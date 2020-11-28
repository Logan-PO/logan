const { Expo } = require('expo-server-sdk');
const { dynamoUtils } = require('@logan/aws');
const { dateUtils } = require('@logan/aws');

let expo = new Expo();

async function sendReminders() {
    const currentTime = dateUtils.formatAsDateTime(dateUtils.dayjs().utc());

    // get reminders that match current (target) time
    const { Items: reminders } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.REMINDERS,
        FilterExpression: ':ts = ts',
        ExpressionAttributeVales: { ':ts': currentTime },
    });

    // much of this from https://github.com/expo/expo-server-sdk-node
    let messages = [];

    // loop through reminders to be sent
    for (let reminder of reminders) {
        // get user for current reminder
        let user = await dynamoUtils.get({
            TableName: dynamoUtils.TABLES.USERS,
            Key: { uid: reminder.uid },
        });

        // get device tokens for current user
        let tokens = user.tokens;

        for (let pushToken of tokens) {
            if (!Expo.isExpoPushToken(pushToken)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
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

    // send messages
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                console.log(ticketChunk);
                tickets.push(ticketChunk);
            } catch (error) {
                console.error(error);
            }
        }
    })();
}

module.exports = {
    sendReminders,
};
