const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const { v4: uuid } = require('uuid');
const requestValidator = require('../utils/request-validator');

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

module.exports = {
    __test_only__: { fromDbFormat, toDbFormat },
};
