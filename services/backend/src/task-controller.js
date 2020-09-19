const _ = require('lodash');
const { AWS } = require('@logan/aws');

const dynamo = new AWS.DynamoDB.DocumentClient();

function fromDbFormat(db) {
    return {
        ..._.pick(db, ['uid', 'tid', 'title', 'aid', 'cid']),
        description: db.desc,
        dueDate: db.due,
        priority: db.pri,
        complete: db.cmp,
    };
}

async function getTask(req, res) {
    const dbResponse = await dynamo
        .get({
            TableName: 'tasks',
            Key: { tid: req.params.tid },
        })
        .promise();

    if (dbResponse.Item) {
        res.json(fromDbFormat(dbResponse.Item));
    } else {
        throw new Error('Task does not exist');
    }
}

async function getTasks(req, res) {}

async function createTask(req, res) {}

async function updateTask(req, res) {}

async function deleteTask(req, res) {}

module.exports = {
    getTask,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
