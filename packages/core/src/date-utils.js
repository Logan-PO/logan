const dayjs = require('dayjs');

// See: https://day.js.org/docs/en/plugin/plugin
const plugins = {
    timezone: require('dayjs/plugin/timezone'),
    dayOfYear: require('dayjs/plugin/dayOfYear'),
    utc: require('dayjs/plugin/utc'),
    weekday: require('dayjs/plugin/weekday'),
    weekOfYear: require('dayjs/plugin/weekOfYear'),
    customParseFormat: require('dayjs/plugin/customParseFormat'),
    advancedFormat: require('dayjs/plugin/advancedFormat'),
    duration: require('dayjs/plugin/duration'),
    minMax: require('dayjs/plugin/minMax'),
    isBetween: require('dayjs/plugin/isBetween'),
    isSameOrBefore: require('dayjs/plugin/isSameOrBefore'),
    isSameOrAfter: require('dayjs/plugin/isSameOrAfter'),
    isYesterday: require('dayjs/plugin/isYesterday'),
    isToday: require('dayjs/plugin/isToday'),
    isTomorrow: require('dayjs/plugin/isTomorrow'),
};

// Extend dayjs with all those plugins
for (const plugin of Object.values(plugins)) {
    dayjs.extend(plugin);
}

function compareDates(d1, d2, format, granularity = 'day') {
    const date1 = dayjs(d1, format);
    const date2 = dayjs(d2, format);

    if (date1.isSame(date2, granularity)) return 0;
    else if (date1.isBefore(date2, granularity)) return -1;
    else return 1;
}

/**
 * @typedef {Object} ReadableDateOptions
 * @property {boolean} [forSentence] Format for use in a sentence, default is false
 * @property {boolean} [includeWeekday] Include weekday in the date formatting, default is false
 */

/**
 * Returns a date formatted in a human readable way, relative to the current date
 * @param date
 * @param {ReadableDateOptions} options
 * @return {string}
 */
function humanReadableDate(date, options = {}) {
    const { forSentence = false, includeWeekday = false } = options;

    date = dayjs(date);
    if (date.isToday()) return forSentence ? 'today' : 'Today';
    else if (date.isTomorrow()) return forSentence ? 'tomorrow' : 'Tomorrow';
    else if (date.isYesterday()) return forSentence ? 'yesterday' : 'Yesterday';
    else {
        const now = dayjs();
        if (date.year() === now.year()) {
            if (date.week() === now.week()) return date.format('dddd');
            else return date.format(includeWeekday ? 'dddd, MMMM Do' : 'MMMM Do');
        } else {
            return date.format(includeWeekday ? 'dddd, MMMM Do, YYYY' : 'MMMM Do, YYYY');
        }
    }
}

function dueDateType(dueDate) {
    if (dueDate === 'asap' || dueDate === 'eventually') {
        return dueDate;
    } else if (dayjs(dueDate, DB_DATE_FORMAT).isValid()) {
        return 'date';
    } else {
        return undefined;
    }
}

function dueDateIsDate(dueDate) {
    return toDate(dueDate).isValid();
}

/**
 * Returns a due date formatted in a human readable way, relative to the current date
 * @param dueDate
 * @param {ReadableDateOptions} options
 * @return {string}
 */
function readableDueDate(dueDate, options = {}) {
    const { forSentence = false } = options;

    if (dueDate === 'asap') return forSentence ? 'asap' : 'ASAP';
    else if (dueDate === 'eventually') return forSentence ? 'eventually' : 'Eventually';
    else return humanReadableDate(dayjs(dueDate), options);
}

// Constants
const DB_DATE_FORMAT = 'YYYY-M-D';
const DB_TIME_FORMAT = 'HH:mm';
const DB_DATETIME_FORMAT = 'YYYY-M-D HH:mm';

function toDate(input) {
    return dayjs(input, DB_DATE_FORMAT);
}

function formatAsDate(obj) {
    return dayjs(obj).format(DB_DATE_FORMAT);
}

function toTime(input) {
    return dayjs(input, DB_TIME_FORMAT);
}

function formatAsTime(obj) {
    return dayjs(obj).format(DB_TIME_FORMAT);
}

function toDateTime(input) {
    return dayjs(input, DB_DATETIME_FORMAT);
}

function formatAsDateTime(obj) {
    return dayjs(obj).format(DB_DATETIME_FORMAT);
}

module.exports = {
    dayjs,
    constants: { DB_DATE_FORMAT, DB_TIME_FORMAT, DB_DATETIME_FORMAT },
    compareDates,
    humanReadableDate,
    dueDateIsDate,
    dueDateType,
    readableDueDate,
    toDate,
    toTime,
    toDateTime,
    formatAsDate,
    formatAsTime,
    formatAsDateTime,
};
