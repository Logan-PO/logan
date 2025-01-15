const { dateUtils } = require('packages/core');

function timeToUTC(time) {
    return dateUtils.formatAsTime(dateUtils.toTime(time).utc());
}

function timeFromUTC(time) {
    const utc = dateUtils.toTime(time).utc(true);
    return dateUtils.formatAsTime(utc.local());
}

function dateTimeToUTC(ts) {
    return dateUtils.formatAsDateTime(dateUtils.toDateTime(ts).utc());
}

function dateTimeFromUTC(ts) {
    const utc = dateUtils.toDateTime(ts).utc(true);
    return dateUtils.formatAsDateTime(utc.local());
}

function sectionFromUTC(original) {
    const updated = { ...original };
    updated.startTime = timeFromUTC(original.startTime);
    updated.endTime = timeFromUTC(original.endTime);
    return updated;
}

function sectionToUTC(original) {
    const updated = { ...original };
    updated.startTime = timeToUTC(original.startTime);
    updated.endTime = timeToUTC(original.endTime);
    return updated;
}

function reminderFromUTC(original) {
    const updated = { ...original };
    updated.timestamp = dateTimeFromUTC(original.timestamp);
    return updated;
}

function reminderToUTC(original) {
    const updated = { ...original };
    updated.timestamp = dateTimeToUTC(original.timestamp);
    return updated;
}

module.exports = {
    timeToUTC,
    timeFromUTC,
    dateTimeToUTC,
    dateTimeFromUTC,
    sectionToUTC,
    sectionFromUTC,
    reminderToUTC,
    reminderFromUTC,
};
