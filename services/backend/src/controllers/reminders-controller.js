const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const {
    dateUtils: {
        dayjs,
        constants: { DB_DATETIME_FORMAT },
    },
} = require('@logan/core');
const { v4: uuid } = require('uuid');
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

async function getReminders(req, res) {
    const requestedBy = req.auth.uid;

    const dbResponse = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.REMINDERS,
        FilterExpression: 'uid = :uid',
        ExpressionAttributeValues: { ':uid': requestedBy },
    });

    res.json(dbResponse.Items.map(fromDbFormat));
}

async function createReminder(req, res) {
    const rid = uuid();

    requestValidator.requireBodyParams(req, ['eid', 'entityType', 'timestamp', 'message']);
    validateTimestamp(req.body.timestamp);

    const reminder = _.merge({}, req.body, { rid }, _.pick(req.auth, ['uid']));

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.REMINDERS,
        Item: toDbFormat(reminder),
    });

    res.json(reminder);
}

async function updateReminder(req, res) {
    requestValidator.requireBodyParams(req, ['rid', 'eid', 'entityType', 'timestamp', 'message']);

    const reminder = _.merge({}, req.body, req.params, _.pick(req.auth, ['uid']));
    validateTimestamp(reminder.timestamp);

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.REMINDERS,
        Item: toDbFormat(reminder),
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    res.json(reminder);
}

async function deleteReminder(req, res) {
    const { rid } = req.params;

    await dynamoUtils.delete({
        TableName: dynamoUtils.TABLES.REMINDERS,
        Key: { rid },
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    res.json({ success: true });
}

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
