const { execSync } = require('child_process');
const _ = require('lodash');
const { argv } = require('yargs');
const { dynamoUtils } = require('@logan/aws');
const { generateBearerToken } = require('../utils/auth');

async function run() {
    const { username, clientType = 'web' } = argv;

    console.log(`Searching for user: ${username}`);
    const response = await dynamoUtils.scan({
        TableName: 'users',
        ExpressionAttributeValues: { ':uname': username },
        FilterExpression: 'uname = :uname',
    });

    if (response.Items.length) {
        console.log(`User found. Generating token for client type '${clientType}'`);
        const user = _.first(response.Items);
        const bearer = await generateBearerToken({ uid: user.uid }, clientType);
        execSync(`echo ${bearer} | pbcopy`);
        console.log('Bearer token copied to clipboard');
    } else {
        throw new Error('User not found');
    }
}

run();
