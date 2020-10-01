const _ = require('lodash');
const AWS = require('./base');

const dynamoClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2020-08-10' });

const TABLES = {
    USERS: 'users',
    TASKS: 'tasks',
    ASSIGNMENTS: 'assignments',
    TERMS: 'terms',
    HOLIDAYS: 'holidays',
    COURSES: 'courses',
    SECTIONS: 'sections',
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
 * @param {string} params.FilterExpression
 * @param {Object} [params.ExpressionAttributeNames]
 * @param {Object} params.ExpressionAttributeValues
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

/**
 * Perform a batchWrite on a single table
 * For info on requests formatting,
 * see: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#batchWrite-property
 * @param {string} tableName
 * @param {Object[]} requests
 * @param {boolean} [autoPaginate = true]
 * @returns {Promise<*>}
 */
async function batchWrite(tableName, requests, autoPaginate = true) {
    if (!autoPaginate) {
        return dynamoClient
            .batchWrite({
                RequestItems: {
                    [tableName]: requests,
                },
            })
            .promise();
    } else {
        let currentIndex = 0;
        do {
            const currentRequests = _.slice(requests, currentIndex, currentIndex + 25);
            const response = await batchWrite(tableName, currentRequests, false);

            const unprocessedItems = _.get(response.UnprocessedItems, [tableName], []);
            currentIndex += currentRequests.length - unprocessedItems.length;
        } while (currentIndex < requests.length);
    }
}

module.exports = {
    get,
    scan,
    put,
    delete: deleteItem,
    batchWrite,
    TABLES,
    makeDeleteRequests,
};
