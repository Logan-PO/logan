const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const {
    dateUtils: { dayjs, constants: dateConstants },
} = require('@logan/core');
const { v4: uuid } = require('uuid');
const requestValidator = require('../../utils/request-validator');
const { NotFoundError } = require('../../utils/errors');

/**
 * @typedef {object} DbSection
 * @property {string} uid User ID
 * @property {string} sid Section ID
 * @property {string} cid Course ID
 * @property {string} title Title
 * @property {string} sd Start date
 * @property {string} ed End date
 * @property {string} st Start time
 * @property {string} et End time
 * @property {number[]} dow Days of week
 * @property {number} wr Weekly repeat
 * @property {string} [loc] Location
 * @property {string} [inst] Instructor
 */

/**
 * @typedef {object} Section
 * @property {string} uid User ID
 * @property {string} sid Section ID
 * @property {string} cid Course ID
 * @property {string} title Title
 * @property {string} startDate Start date
 * @property {string} endDate End date
 * @property {string} startTime Start time
 * @property {string} endTime End time
 * @property {number[]} daysOfWeek Days of week
 * @property {number} weeklyRepeat Weekly repeat
 * @property {string} [location] Location
 * @property {string} [instructor] Instructor
 */

/**
 * @param {DbSection} db
 * @return {Section}
 */
function fromDbFormat(db) {
    return {
        ..._.pick(db, ['uid', 'cid', 'sid', 'title']),
        startDate: db.sd,
        endDate: db.ed,
        startTime: db.st,
        endTime: db.et,
        daysOfWeek: db.dow,
        weeklyRepeat: db.wr,
        location: db.loc,
        instructor: db.inst,
    };
}

/**
 * @param {Section} section
 * @return {DbSection}
 */
function toDbFormat(section) {
    return {
        ..._.pick(section, ['uid', 'cid', 'sid', 'title']),
        sd: dayjs(section.startDate).format(dateConstants.DB_DATE_FORMAT),
        ed: dayjs(section.endDate).format(dateConstants.DB_DATE_FORMAT),
        st: dayjs(section.startTime, 'HH:mm').format(dateConstants.DB_TIME_FORMAT),
        et: dayjs(section.endTime, 'HH:mm').format(dateConstants.DB_TIME_FORMAT),
        dow: section.daysOfWeek,
        wr: section.weeklyRepeat,
        loc: section.location,
        inst: section.instructor,
    };
}

async function getSection(req, res) {
    const requestedSid = req.params.sid;

    const dbResponse = await dynamoUtils.get({
        TableName: dynamoUtils.TABLES.SECTIONS,
        Key: { Sid: requestedSid },
    });

    if (dbResponse.Item) {
        res.json(fromDbFormat(dbResponse.Item));
    } else {
        throw new NotFoundError('Section does not exist');
    }
}

async function getSections(req, res) {
    const requestedBy = req.auth.uid;

    const dbResponse = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.SECTIONS,
        FilterExpression: 'uid = :uid',
        ExpressionAttributeValues: { ':uid': requestedBy },
    });

    res.json(dbResponse.Items.map(fromDbFormat));
}

async function createSection(req, res) {
    const sid = uuid();

    const section = _.merge({}, req.body, { sid }, _.pick(req.auth, ['uid']));

    requestValidator.requireBodyParams(req, [
        'cid',
        'title',
        'startDate',
        'endDate',
        'startTime',
        'endTime',
        'daysOfWeek',
        'weeklyRepeat',
    ]);

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.SECTIONS,
        Item: toDbFormat(section),
    });

    res.json(section);
}

async function updateSection(req, res) {
    const section = _.merge({}, req.body, req.params, _.pick(req.auth, ['uid']));

    requestValidator.requireBodyParams(req, [
        'cid',
        'title',
        'startDate',
        'endDate',
        'startTime',
        'endTime',
        'daysOfWeek',
        'weeklyRepeat',
    ]);

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.SECTIONS,
        Item: toDbFormat(section),
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    res.json(section);
}

async function deleteSection(req, res) {
    const requestedSid = req.params.sid;

    await dynamoUtils.delete({
        TableName: dynamoUtils.TABLES.SECTIONS,
        Key: { sid: requestedSid },
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    res.json({ success: true });
}

module.exports = {
    __test_only__: { fromDbFormat, toDbFormat },
    getSection,
    getSections,
    createSection,
    updateSection,
    deleteSection,
};
