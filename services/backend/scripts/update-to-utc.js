const { dynamoUtils } = require('@logan/aws');
const { dateUtils } = require('@logan/core');

function timeToUTC(time) {
    return dateUtils.formatAsTime(dateUtils.toTime(time).utc());
}

function dateTimeToUTC(ts) {
    return dateUtils.formatAsDateTime(dateUtils.toDateTime(ts).utc());
}

function sectionToUTC(original) {
    const updated = { ...original };
    updated.startTime = timeToUTC(original.startTime);
    updated.endTime = timeToUTC(original.endTime);
    return updated;
}

function reminderToUTC(original) {
    const updated = { ...original };
    updated.timestamp = dateTimeToUTC(original.timestamp);
    return updated;
}

async function runReplacement() {
    const { Items: allSections } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.SECTIONS,
        AutoPaginate: true,
    });

    const updatedSections = allSections.map(sectionToUTC);

    await dynamoUtils.batchWrite({
        [dynamoUtils.TABLES.SECTIONS]: updatedSections.map(s => ({ PutRequest: { Item: s } })),
    });

    const { Items: allReminders } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.REMINDERS,
        AutoPaginate: true,
    });

    const updatedReminders = allReminders.map(reminderToUTC);

    await dynamoUtils.batchWrite({
        [dynamoUtils.TABLES.REMINDERS]: updatedReminders.map(r => ({ PutRequest: { Item: r } })),
    });
}

runReplacement();
