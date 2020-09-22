const AWS = require('./base');

const dynamoClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2020-08-10' });

function get(params) {
    return dynamoClient.get(params).promise();
}

function scan(params) {
    return dynamoClient.scan(params).promise();
}

function put(params) {
    return dynamoClient.put(params).promisse();
}

function deleteItem(params) {
    return dynamoClient.delete(params).promise();
}

module.exports = {
    get,
    scan,
    put,
    delete: deleteItem,
};
