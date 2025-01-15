const _ = require('lodash');
const { dynamoUtils } = require('packages/aws');
const {
    dateUtils: {
        dayjs,
        constants: { DB_DATETIME_FORMAT },
    },
} = require('packages/core');
const { v4: uuid } = require('uuid');
const { makeHandler } = require('../../utils/wrap-handler');
const requestValidator = require('../../utils/request-validator');
const { ValidationError } = require('../../utils/errors');

/**
 * @typedef {Object} Reminder
 * @property {string} rid
 * @property {string} uid
 * @property {string} entityType Either assignment or task
 * @property {string} eid The entity ID
 * @property {string} timestamp When to send the reminder
 * @property {string} message The content of the reminder
 */

/**
 * @typedef DBReminder
 * @property {string} rid
 * @property {string} uid
 * @property {string} et entityType
 * @property {string} eid
 * @property {string} ts timestamp
 * @property {string} msg content
 */

/**
 * @param {DBReminder} db
 * @return {Reminder}
 */
function fromDbFormat(db) {
    return {
        ..._.pick(db, ['rid', 'uid', 'eid']),
        entityType: db.et,
        timestamp: db.ts,
        message: db.msg,
    };
}

/**
 * @param {Reminder} reminder
 * @return {DBReminder}
 */
function toDbFormat(reminder) {
    return {
        ..._.pick(reminder, ['rid', 'uid', 'eid']),
        et: reminder.entityType,
        ts: reminder.timestamp,
        msg: reminder.message,
    };
}

function validateTimestamp(ts) {
    if (!dayjs(ts, DB_DATETIME_FORMAT).isValid()) {
        throw new ValidationError(`Invalid reminder timestamp ${ts}. Must be in format ${DB_DATETIME_FORMAT}`);
    }
}

const getReminders = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const requestedBy = event.auth.uid;

        const dbResponse = await dynamoUtils.scan({
            TableName: dynamoUtils.TABLES.REMINDERS,
            FilterExpression: 'uid = :uid',
            ExpressionAttributeValues: { ':uid': requestedBy },
        });

        return dbResponse.Items.map(fromDbFormat);
    },
});

const createReminder = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const rid = uuid();

        requestValidator.requireBodyParams(event, ['eid', 'entityType', 'timestamp', 'message']);
        validateTimestamp(event.body.timestamp);

        const reminder = _.merge({}, event.body, { rid }, _.pick(event.auth, ['uid']));

        await dynamoUtils.put({
            TableName: dynamoUtils.TABLES.REMINDERS,
            Item: toDbFormat(reminder),
        });

        return reminder;
    },
});

const updateReminder = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        requestValidator.requireBodyParams(event, ['rid', 'eid', 'entityType', 'timestamp', 'message']);

        const reminder = _.merge({}, event.body, event.pathParameters, _.pick(event.auth, ['uid']));
        validateTimestamp(reminder.timestamp);

        await dynamoUtils.put({
            TableName: dynamoUtils.TABLES.REMINDERS,
            Item: toDbFormat(reminder),
            ExpressionAttributeValues: { ':uid': event.auth.uid },
            ConditionExpression: 'uid = :uid',
        });

        return reminder;
    },
});

const deleteReminder = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const { rid } = event.pathParameters;

        await dynamoUtils.delete({
            TableName: dynamoUtils.TABLES.REMINDERS,
            Key: { rid },
            ExpressionAttributeValues: { ':uid': event.auth.uid },
            ConditionExpression: 'uid = :uid',
        });

        return { success: true };
    },
});

async function remindersForEntity(type, eid) {
    const { Items: dbReminders } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.REMINDERS,
        FilterExpression: ':eid = eid and :et = et',
        ExpressionAttributeValues: { ':eid': eid, ':et': type },
    });

    return dbReminders.map(fromDbFormat);
}

module.exports = {
    __test_only__: { fromDbFormat, toDbFormat },
    getReminders,
    createReminder,
    updateReminder,
    deleteReminder,
    remindersForEntity,
};
