const dayjs = require('dayjs');

// See: https://day.js.org/docs/en/plugin/plugin
const plugins = {
    weekday: require('dayjs/plugin/weekday'),
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

function humanReadableDate(date) {
    if (date.isToday()) return 'Today';
    else if (date.isTomorrow()) return 'Tomorrow';
    else if (date.isYesterday()) return 'Yesterday';
    else if (date.year() === dayjs().year()) return date.format('MMMM Do');
    else return date.format('MMMM Do, YYYY');
}

function dueDateIsDate(dueDate) {
    return dueDate !== 'asap' && dueDate !== 'eventually';
}

function readableDueDate(dueDate) {
    if (dueDate === 'asap') return 'ASAP';
    else if (dueDate === 'eventually') return 'Eventually';
    else return humanReadableDate(dayjs(dueDate));
}

// Constants
const DB_DATE_FORMAT = 'YYYY-M-D';
const DB_TIME_FORMAT = 'HH:mm';
const DB_DATETIME_FORMAT = 'YYYY-M-D H:m';

module.exports = {
    dayjs,
    constants: { DB_DATE_FORMAT, DB_TIME_FORMAT, DB_DATETIME_FORMAT },
    compareDates,
    humanReadableDate,
    dueDateIsDate,
    readableDueDate,
};
