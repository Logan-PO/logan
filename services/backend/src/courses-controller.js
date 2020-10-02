const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const { v4: uuid } = require('uuid');
const requestValidator = require('../utils/request-validator');

function fromDbFormat(db) {
    return {
        ..._.pick(db, ['uid', 'tid', 'cid', 'title']),
        nickname: db.nn,
        color: db.col,
    };
}

function toDbFormat(course) {
    return {
        ..._.pick(course, ['uid', 'tid', 'cid', 'title']),
        nn: course.nickname,
        col: course.color,
    };
}

async function getCourse(req, res) {
    const requestedCid = req.params.cid;

    const dbResponse = await dynamoUtils.get({
        TableName: dynamoUtils.TABLES.COURSES,
        Key: { cid: requestedCid },
    });

    if (dbResponse.Item) {
        res.json(fromDbFormat(dbResponse.Item));
    } else {
        throw new Error('Course does not exist');
    }
}

async function getCourses(req, res) {
    const requestedBy = req.auth.uid;

    const dbResponse = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.COURSES,
        FilterExpression: 'uid = :uid',
        ExpressionAttributeValues: { ':uid': requestedBy },
    });

    res.json(dbResponse.Items.map(fromDbFormat));
}

async function createCourse(req, res) {
    const cid = uuid();

    const course = _.merge({}, req.body, { cid }, _.pick(req.auth, ['uid']));

    requestValidator.requireBodyParams(req, ['tid', 'title', 'color']);

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.COURSES,
        Item: toDbFormat(course),
    });

    res.json(course);
}

async function updateCourse(req, res) {
    const course = _.merge({}, req.body, req.params, _.pick(req.auth, ['uid']));

    requestValidator.requireBodyParams(req, ['tid', 'title', 'color']);

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.COURSES,
        Item: toDbFormat(course),
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    res.json(course);
}

async function deleteCourse(req, res) {
    const requestedCid = req.params.cid;

    await dynamoUtils.delete({
        TableName: dynamoUtils.TABLES.COURSES,
        Key: { cid: requestedCid },
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    res.json({ success: true });
}

module.exports = {
    __test_only__: { fromDbFormat, toDbFormat },
    getCourse,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
};
