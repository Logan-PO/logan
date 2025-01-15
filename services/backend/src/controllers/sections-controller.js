const _ = require('lodash');
const { v4: uuid } = require('uuid');
const { makeHandler } = require('../../utils/wrap-handler');
const requestValidator = require('../../utils/request-validator');
const { NotFoundError } = require('../../utils/errors');
const {
    dateUtils: { dayjs, constants: dateConstants },
} = require('packages/core');
const { dynamoUtils } = require('packages/aws');

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

const getSection = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const requestedSid = event.pathParameters.sid;

        const dbResponse = await dynamoUtils.get({
            TableName: dynamoUtils.TABLES.SECTIONS,
            Key: { Sid: requestedSid },
        });

        if (dbResponse.Item) {
            return fromDbFormat(dbResponse.Item);
        } else {
            throw new NotFoundError('Section does not exist');
        }
    },
});

const getSections = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const requestedBy = event.auth.uid;

        const dbResponse = await dynamoUtils.scan({
            TableName: dynamoUtils.TABLES.SECTIONS,
            FilterExpression: 'uid = :uid',
            ExpressionAttributeValues: { ':uid': requestedBy },
        });

        return dbResponse.Items.map(fromDbFormat);
    },
});

const createSection = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const sid = uuid();

        const section = _.merge({}, event.body, { sid }, _.pick(event.auth, ['uid']));

        requestValidator.requireBodyParams(event, [
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

        return section;
    },
});

const updateSection = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const section = _.merge({}, event.body, event.pathParameters, _.pick(event.auth, ['uid']));

        requestValidator.requireBodyParams(event, [
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
            ExpressionAttributeValues: { ':uid': event.auth.uid },
            ConditionExpression: 'uid = :uid',
        });

        return section;
    },
});

const deleteSection = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const requestedSid = event.pathParameters.sid;

        await dynamoUtils.delete({
            TableName: dynamoUtils.TABLES.SECTIONS,
            Key: { sid: requestedSid },
            ExpressionAttributeValues: { ':uid': event.auth.uid },
            ConditionExpression: 'uid = :uid',
        });

        return { success: true };
    },
});

module.exports = {
    __test_only__: { fromDbFormat, toDbFormat },
    getSection,
    getSections,
    createSection,
    updateSection,
    deleteSection,
};
