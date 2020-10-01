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

module.exports = {
    get,
    scan,
    put,
    delete: deleteItem,
    TABLES,
};
