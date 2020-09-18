const _ require('lodash');
const { AWS } = require('@logan/aws');
const { v4: uuid } = require('uuid');

const dynamo = new AWS.DynamoDB.DocumentClient();

// I saw you used this function but I was not sure if I needed it or if I should use it
// I duplicated it here anyways and figured it can be changed later of need be
// genrally I used this function but am still not sure what it does exactly or if it is necessary

function fromDbFormat(db) {
    return {
        ..._.pick(db, ['aid', 'uid', 'title', 'desc', 'due', 'cid'])
    };
}

// I followed the format similar to what you used for getUser

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
    const requestedBy = req.body.uid;

    // im assuming query() works well to get all assignments
    // i did not consider the case of getting a subset of assignments instead of all assignments
    

    const dbResponse = await dynamo
    .query({
        TableName: 'assignments',
        Key: { uid: requestedBy },
    })
    .promise();

    // I tried to follow a similar format to getting a single assignment
    // I want to add a check in case of no assingments existing
    // again I am not sure if I need to use the helper function fromDbFormat
    // not sure how to return all assignments from query() to frontend

    if (dbResponse.Items) {
        res.json(fromDbFormat(dbResponse.Item));
    }
    else {
        throw new Error('No assignments exist');
    }
    
}

// I was not sure how to handle creation of assignments yet
// would we be provided with the aid or would we need to generate an aid?
// considering creation is triggered by route /assignments and not /assignments/:aid

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

    // again unsure about the helper function

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
