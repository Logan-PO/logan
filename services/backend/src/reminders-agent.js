const _ = require('lodash');
const { Expo } = require('expo-server-sdk');
const { dynamoUtils } = require('packages/aws');
const { dateUtils } = require('packages/core');

let expo = new Expo();
let timeoutId;
let intervalId;

const MINUTE_INTERVAL = 15;

function scheduleFirstRun() {
    const now = dateUtils.dayjs();
    const minutesFloored = Math.floor(now.minute() / MINUTE_INTERVAL) * MINUTE_INTERVAL;

    if (minutesFloored === now.minute()) {
        return firstRun();
    } else {
        const firstRunTs = now.startOf('hour').minute(minutesFloored).add(MINUTE_INTERVAL, 'minute').add(5, 'second');
        const msToFirstRun = firstRunTs.diff(dateUtils.dayjs(), 'ms');

        clearTimeout(timeoutId);
        clearInterval(intervalId);

        console.debug(`Scheduling first reminder batch for ${dateUtils.formatAsDateTime(firstRunTs)}`);

        timeoutId = setTimeout(firstRun, msToFirstRun);
    }
}

function firstRun() {
    clearTimeout(timeoutId);
    intervalId = setInterval(sendReminders, MINUTE_INTERVAL * 60 * 1000);
    return sendReminders();
}

async function sendReminders() {
    const currentTime = dateUtils.formatAsDateTime(dateUtils.dayjs().utc());

    // get reminders that match current (target) time
    const { Items: reminders } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.REMINDERS,
        FilterExpression: ':ts = ts',
        ExpressionAttributeValues: { ':ts': currentTime },
    });

    console.debug(`${reminders.length} reminders found`);

    if (!reminders.length) return;

    const uids = _.uniq(_.map(reminders, 'uid'));

    const {
        Responses: { users },
    } = await dynamoUtils.batchGet({
        RequestItems: {
            users: {
                Keys: uids.map(uid => ({ uid })),
            },
        },
    });

    const usersMap = {};

    for (const user of users) {
        usersMap[user.uid] = user;
    }

    // much of this from https://github.com/expo/expo-server-sdk-node
    let messages = [];

    const invalidTokens = [];

    // loop through reminders to be sent
    for (let reminder of reminders) {
        const user = usersMap[reminder.uid];

        // get device tokens for current user
        let tokens = _.get(user, 'tokens', []);

        for (let pushToken of tokens) {
            if (!Expo.isExpoPushToken(pushToken)) {
                console.warn(`Push token ${pushToken} is not a valid Expo push token`);
                invalidTokens.push({
                    token: pushToken,
                    reminder,
                });

                continue;
            }

            // create message
            messages.push({
                to: pushToken,
                sound: 'default',
                body: reminder.msg,
            });
        }
    }

    if (invalidTokens.length) {
        console.log('Reminders with invalid tokens:');
        console.log(JSON.stringify(invalidTokens, null, 4));
    }

    if (!messages.length) {
        console.log('No valid messages to send');
        return;
    }

    // Send reminders
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(ticketChunk);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = {
    scheduleFirstRun,
    sendReminders,
};
