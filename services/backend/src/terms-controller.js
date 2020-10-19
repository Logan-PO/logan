const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const {
    dateUtils: {
        dayjs,
        constants: { DB_DATE_FORMAT },
    },
} = require('@logan/core');
const { v4: uuid } = require('uuid');
const Promise = require('bluebird');
const requestValidator = require('../utils/request-validator');
const { NotFoundError } = require('../utils/errors');
const coursesController = require('./courses-controller');

function fromDbFormat(db) {
    return {
        ..._.pick(db, ['uid', 'tid', 'title']),
        startDate: dayjs(db.sd, DB_DATE_FORMAT).startOf('day'),
        endDate: dayjs(db.ed, DB_DATE_FORMAT).endOf('day'),
    };
}

function toDbFormat(term) {
    return {
        ..._.pick(term, ['uid', 'tid', 'title']),
        sd: dayjs(term.startDate).format(DB_DATE_FORMAT),
        ed: dayjs(term.endDate).format(DB_DATE_FORMAT),
    };
}

async function getTerm(req, res) {
    const requestedTid = req.params.tid;

    const dbResponse = await dynamoUtils.get({
        TableName: dynamoUtils.TABLES.TERMS,
        Key: { tid: requestedTid },
    });

    if (dbResponse.Item) {
        res.json(fromDbFormat(dbResponse.Item));
    } else {
        throw new NotFoundError('Term does not exist');
    }
}

async function getTerms(req, res) {
    const requestedBy = req.auth.uid;

    const dbResponse = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.TERMS,
        FilterExpression: 'uid = :uid',
        ExpressionAttributeValues: { ':uid': requestedBy },
    });

    res.json(dbResponse.Items.map(fromDbFormat));
}

async function createTerm(req, res) {
    const tid = uuid();

    const term = _.merge({}, req.body, { tid }, _.pick(req.auth, ['uid']));

    requestValidator.requireBodyParams(req, ['title', 'startDate', 'endDate']);

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.TERMS,
        Item: toDbFormat(term),
    });

    res.json(term);
}

async function updateTerm(req, res) {
    const term = _.merge({}, req.body, req.params, _.pick(req.auth, ['uid']));

    requestValidator.requireBodyParams(req, ['title', 'startDate', 'endDate']);

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.TERMS,
        Item: toDbFormat(term),
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    res.json(term);
}

async function deleteTerm(req, res) {
    const requestedTid = req.params.tid;

    await dynamoUtils.delete({
        TableName: dynamoUtils.TABLES.TERMS,
        Key: { tid: requestedTid },
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    await handleCascadingDeletes(requestedTid);

    res.json({ success: true });
}

async function handleCascadingDeletes(tid) {
    // Delete courses
    const { Items: courses } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.COURSES,
        ExpressionAttributeValues: { ':tid': tid },
        FilterExpression: ':tid = tid',
        AutoPaginate: true,
    });

    const courseDeletes = dynamoUtils.makeDeleteRequests(courses, 'cid');
    await dynamoUtils.batchWrite({ [dynamoUtils.TABLES.COURSES]: courseDeletes });

    await Promise.map(courses, ({ cid }) => coursesController.handleCascadingDeletes(cid), { concurrency: 3 });

    // Delete holidays
    const { Items: holidays } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.HOLIDAYS,
        ExpressionAttributeValues: { ':tid': tid },
        FilterExpression: ':tid = tid',
        AutoPaginate: true,
    });

    const holidayDeletes = dynamoUtils.makeDeleteRequests(holidays, 'hid');
    await dynamoUtils.batchWrite({ [dynamoUtils.TABLES.HOLIDAYS]: holidayDeletes });
}

module.exports = {
    __test_only__: { fromDbFormat, toDbFormat },
    getTerm,
    getTerms,
    createTerm,
    updateTerm,
    deleteTerm,
};
