const _ require('lodash');
const { AWS } = require('@logan/aws');
const { v4: uuid } = require('uuid');

const dynamo = new AWS.DynamoDB.DocumentClient();

function fromDbFormat(db) {
    return {
        ..._.pick(db, ['aid', 'uid', 'title', 'desc', 'due', 'cid'])
    };
}

async function getAssignment(req, res) {
    const requestedAid = req.params.aid;

    const dbResponse = await dynamo
        .get({
            TableName: 'assignments',
            Key: { aid: requestedAid },
        })
        .promise();

    if (dbResponse.Item) {
        res.json(fromDbFormat(dbResponse.Item));
    }
    else {
        throw new Error('Assignment does not exist');
    }
}

async function getAssignments(req, res) {
    const requestedBy = req.auth.uid;

    const dbResponse = await dynamo
    .query({
        TableName: 'assignments',
        Key: { uid: requestedBy },
    })
    .promise();

    if (dbResponse.Items) {
        res.json(fromDbFormat(dbResponse.Item));
    }
    else {
        throw new Error('No assignments exist');
    }

}

async function createAssignment(req, res) { }

async function updateAssignment(req, res) {
    const assignment = {
        aid: req.params.aid,
        uid: req.body.uid,
        title: req.body.title,
        desc: req.body.desc,
        due: req.body.due,
        cid: req.body.cid,
    };

    await dynamo.put({
        TableName: 'assignments',
        Item: assignment
    })
    .promise();

    res.json(fromDbFormat(assignemt));
}

async function deleteAssignment(req, res) {
    const requestedAid = req.params.aid;

    await dynamo.delete({
        TableName: 'assignments',
        Key: { aid: requestedAid },
    })
    .promise();

    res.json({ success: true });
}

module.exports = {
    getAssignment,
    getAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
};
