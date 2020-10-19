const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const {
    dateUtils: {
        dayjs,
        constants: { DB_DATE_FORMAT },
    },
} = require('@logan/core');
const { v4: uuid } = require('uuid');
const requestValidator = require('../utils/request-validator');
const { NotFoundError } = require('../utils/errors');

function fromDbFormat(db) {
    return {
        ..._.pick(db, ['uid', 'tid', 'hid', 'title']),
        startDate: dayjs(db.sd, DB_DATE_FORMAT).startOf('day'),
        endDate: dayjs(db.ed, DB_DATE_FORMAT).endOf('day'),
    };
}

function toDbFormat(holiday) {
    return {
        ..._.pick(holiday, ['uid', 'tid', 'hid', 'title']),
        sd: dayjs(holiday.startDate).format(DB_DATE_FORMAT),
        ed: dayjs(holiday.endDate).format(DB_DATE_FORMAT),
    };
}

async function getHoliday(req, res) {
    const requestedHid = req.params.hid;

    const dbResponse = await dynamoUtils.get({
        TableName: dynamoUtils.TABLES.HOLIDAYS,
        Key: { hid: requestedHid },
    });

    if (dbResponse.Item) {
        res.json(fromDbFormat(dbResponse.Item));
    } else {
        throw new NotFoundError('Holiday does not exist');
    }
}

async function getHolidays(req, res) {
    const requestedBy = req.auth.uid;

    const dbResponse = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.HOLIDAYS,
        FilterExpression: 'uid = :uid',
        ExpressionAttributeValues: { ':uid': requestedBy },
    });

    res.json(dbResponse.Items.map(fromDbFormat));
}

async function createHoliday(req, res) {
    const hid = uuid();

    const holiday = _.merge({}, req.body, { hid }, _.pick(req.auth, ['uid']));

    requestValidator.requireBodyParams(req, ['tid', 'title', 'startDate', 'endDate']);

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.HOLIDAYS,
        Item: toDbFormat(holiday),
    });

    res.json(holiday);
}

async function updateHoliday(req, res) {
    const holiday = _.merge({}, req.body, req.params, _.pick(req.auth, ['uid']));

    requestValidator.requireBodyParams(req, ['tid', 'title', 'startDate', 'endDate']);

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.HOLIDAYS,
        Item: toDbFormat(holiday),
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    res.json(holiday);
}

async function deleteHoliday(req, res) {
    const requestedHid = req.params.hid;

    await dynamoUtils.delete({
        TableName: dynamoUtils.TABLES.HOLIDAYS,
        Key: { hid: requestedHid },
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    res.json({ success: true });
}

module.exports = {
    __test_only__: { fromDbFormat, toDbFormat },
    getHoliday,
    getHolidays,
    createHoliday,
    updateHoliday,
    deleteHoliday,
};
