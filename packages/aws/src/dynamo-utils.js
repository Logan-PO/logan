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
 * @param {number} [params.Limit]
 * @returns {Promise<{Items:Object[]}>}
 */
function scan(params) {
    return dynamoClient.scan(params).promise();
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

/**
 * @param {Object} params
 * @param {string} params.TableName
 * @param {string} params.FilterExpression
 * @param {Object} [params.ExpressionAttributeNames]
 * @param {Object} params.ExpressionAttributeValues
 * @param {string} deleteKey - The primary key for the table you're deleting from
 * @returns {Promise<void>}
 */
async function batchDeleteFromScan(params, deleteKey) {
    const itemsToDelete = [];

    // Fetch all the items to delete with a paginated scan
    let scanResponse;
    do {
        const scanParams = { ...params };

        if (scanResponse && scanResponse.LastEvaluatedKey) scanParams.ExclusiveStartKey = scanResponse.LastEvaluatedKey;

        scanResponse = await scan(scanParams);
        itemsToDelete.push(...scanResponse.Items);
    } while (scanResponse.LastEvaluatedKey);

    // If there are no items to delete, return
    if (!itemsToDelete.length) return;

    // Map to the actual delete requests
    const deleteRequests = itemsToDelete.map(item => ({
        DeleteRequest: {
            Key: _.pick(item, [deleteKey]),
        },
    }));

    // Delete
    let currentIndex = 0;
    do {
        // You can only make a maximum of 25 batchWrite requests at once
        const currentRequests = _.slice(deleteRequests, currentIndex, currentIndex + 25);
        const writeResponse = await dynamoClient
            .batchWrite({
                RequestItems: {
                    [params.TableName]: currentRequests,
                },
            })
            .promise();

        const unprocessedItems = _.get(writeResponse.UnprocessedItems, [params.TableName], []);
        currentIndex += currentRequests.length - unprocessedItems.length;
    } while (currentIndex < deleteRequests.length);
}

module.exports = {
    get,
    scan,
    put,
    delete: deleteItem,
    batchDeleteFromScan,
    TABLES,
};
