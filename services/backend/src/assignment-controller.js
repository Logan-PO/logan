const _ require('lodash');
const { AWS } = require('@logan/aws');
const { v4: uuid } = require('uuid');

const dynamo = new AWS.DynamoDB.DocumentClient();

async function getAssignment(req, res) { }

async function getAssignments(req, res) { }

async function createAssignment(req, res) { }

async function updateAssignment(req, res) { }

async function deleteAssignment(req, res) { }

module.exports = {
    getAssignment,
    getAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
};
