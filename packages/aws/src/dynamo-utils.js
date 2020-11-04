const _ = require('lodash');
const AWS = require('./base');

const config = { apiVersion: '2020-08-10' };

if (process.env.MOCK_DYNAMODB_ENDPOINT) {
    config.endpoint = process.env.MOCK_DYNAMODB_ENDPOINT;
    config.sslEnabled = false;
    config.region = 'local';
}

const dynamoClient = new AWS.DynamoDB.DocumentClient(config);

const TABLES = {
    USERS: 'users',
    TASKS: 'tasks',
    ASSIGNMENTS: 'assignments',
    TERMS: 'terms',
    HOLIDAYS: 'holidays',
    COURSES: 'courses',
    SECTIONS: 'sections',
    REMINDERS: 'reminders',
};

const PKEYS = {
    [TABLES.USERS]: 'uid',
    [TABLES.TASKS]: 'tid',
    [TABLES.ASSIGNMENTS]: 'aid',
    [TABLES.TERMS]: 'tid',
    [TABLES.HOLIDAYS]: 'hid',
    [TABLES.COURSES]: 'cid',
    [TABLES.SECTIONS]: 'sid',
    [TABLES.REMINDERS]: ['rid', 'eid'],
};

/**
 * @param {Object} params
 * @param {string} params.TableName
 * @param {Object} params.Key
 * @returns {Promise<{Item:Object}>}
 */
function get(params) {
    return dynamoClient.get(params).promise();
}

/**
 * @param {Object} params
 * @param {string} params.TableName
 * @param {string} [params.FilterExpression]
 * @param {Object} [params.ExpressionAttributeNames]
 * @param {Object} [params.ExpressionAttributeValues]
 * @param {boolean} [params.AutoPaginate = false]
 * @param [params.ExclusiveStartKey] - Used in pagination
 * @returns {Promise<{Items:Object[],[LastEvaluatedKey]}>}
 */
async function scan(params) {
    const shouldPaginate = params.AutoPaginate;
    if (shouldPaginate) {
        params = _.omit(params, ['AutoPaginate']);

        const items = [];
        let response;
        do {
            if (_.get(response, 'LastEvaluatedKey')) params.ExclusiveStartKey = response.LastEvaluatedKey;
            response = await scan(params);
            items.push(...response.Items);
        } while (response.LastEvaluatedKey);

        return { Items: items };
    } else {
        return dynamoClient.scan(params).promise();
    }
}

/**
 * @param {Object} params
 * @param {string} params.TableName
 * @param {Object} params.Item
 * @param {string} [params.ConditionExpression]
 * @param {Object} [params.ExpressionAttributeNames]
 * @param {Object} [params.ExpressionAttributeValues]
 * @returns {Promise<{Attributes:Object}>}
 */
function put(params) {
    return dynamoClient.put(params).promise();
}

/**
 * @param {Object} params
 * @param {string} params.TableName
 * @param {Object} params.Key
 * @param {string} [params.ConditionExpression]
 * @param {Object} [params.ExpressionAttributeNames]
 * @param {Object} [params.ExpressionAttributeValues]
 * @returns {Promise<{Attributes:Object}>}
 */
function deleteItem(params) {
    return dynamoClient.delete(params).promise();
}

function makeDeleteRequests(items, key) {
    return items.map(item => ({ DeleteRequest: { Key: _.pick(item, key) } }));
}

function flattenRequestItems(requestItems) {
    return _.chain(requestItems)
        .entries()
        .flatMap(([tableName, requests]) => requests.map(request => ({ TableName: tableName, ...request })))
        .value();
}

function unflattenRequestItems(flattened) {
    const grouped = _.groupBy(flattened, 'TableName');
    return _.mapValues(grouped, requests => requests.map(request => _.omit(request, 'TableName')));
}

async function batchWrite(requestItems, { autoPaginate = true, expectFlat = false } = {}) {
    // Exit if empty request items
    if (!(expectFlat ? requestItems : _.flatten(_.values(requestItems))).length) return;

    if (!autoPaginate) {
        if (expectFlat) return dynamoClient.batchWrite({ RequestItems: unflattenRequestItems(requestItems) }).promise();
        return dynamoClient.batchWrite({ RequestItems: requestItems }).promise();
    } else {
        let flat = expectFlat ? requestItems : flattenRequestItems(requestItems);

        do {
            const currentRequests = _.slice(flat, 0, 25);
            const response = await batchWrite(currentRequests, { autoPaginate: false, expectFlat: true });
            flat = _.drop(flat, 25);

            if (!_.isEmpty(response.UnprocessedItems)) {
                flat.push(...flattenRequestItems(response.UnprocessedItems));
            }
        } while (flat.length);
    }
}

module.exports = {
    get,
    scan,
    put,
    delete: deleteItem,
    batchWrite,
    makeDeleteRequests,
    TABLES,
    PKEYS,
};
