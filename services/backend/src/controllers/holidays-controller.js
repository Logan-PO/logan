const _ = require('lodash');
const { dynamoUtils } = require('packages/aws');
const {
    dateUtils: {
        dayjs,
        constants: { DB_DATE_FORMAT },
    },
} = require('packages/core');
const { v4: uuid } = require('uuid');
const requestValidator = require('../../utils/request-validator');
const { NotFoundError } = require('../../utils/errors');
const { makeHandler } = require('../../utils/wrap-handler');

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

const getHoliday = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const requestedHid = event.pathParameters.hid;

        const dbResponse = await dynamoUtils.get({
            TableName: dynamoUtils.TABLES.HOLIDAYS,
            Key: { hid: requestedHid },
        });

        if (dbResponse.Item) {
            return fromDbFormat(dbResponse.Item);
        } else {
            throw new NotFoundError('Holiday does not exist');
        }
    },
});

const getHolidays = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const requestedBy = event.auth.uid;

        const dbResponse = await dynamoUtils.scan({
            TableName: dynamoUtils.TABLES.HOLIDAYS,
            FilterExpression: 'uid = :uid',
            ExpressionAttributeValues: { ':uid': requestedBy },
        });

        return dbResponse.Items.map(fromDbFormat);
    },
});

const createHoliday = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const hid = uuid();

        const holiday = _.merge({}, event.body, { hid }, _.pick(event.auth, ['uid']));

        requestValidator.requireBodyParams(event, ['tid', 'title', 'startDate', 'endDate']);

        await dynamoUtils.put({
            TableName: dynamoUtils.TABLES.HOLIDAYS,
            Item: toDbFormat(holiday),
        });

        return holiday;
    },
});

const updateHoliday = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const holiday = _.merge({}, event.body, event.pathParameters, _.pick(event.auth, ['uid']));

        requestValidator.requireBodyParams(event, ['tid', 'title', 'startDate', 'endDate']);

        await dynamoUtils.put({
            TableName: dynamoUtils.TABLES.HOLIDAYS,
            Item: toDbFormat(holiday),
            ExpressionAttributeValues: { ':uid': event.auth.uid },
            ConditionExpression: 'uid = :uid',
        });

        return holiday;
    },
});

const deleteHoliday = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const requestedHid = event.pathParameters.hid;

        await dynamoUtils.delete({
            TableName: dynamoUtils.TABLES.HOLIDAYS,
            Key: { hid: requestedHid },
            ExpressionAttributeValues: { ':uid': event.auth.uid },
            ConditionExpression: 'uid = :uid',
        });

        return { success: true };
    },
});

module.exports = {
    __test_only__: { fromDbFormat, toDbFormat },
    getHoliday,
    getHolidays,
    createHoliday,
    updateHoliday,
    deleteHoliday,
};
