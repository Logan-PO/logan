const tableKeyMap = {
    users: 'uid',
    terms: 'tid',
    courses: 'cid',
    holidays: 'hid',
    sections: 'sid',
    assignments: 'aid',
    tasks: 'tid',
    reminders: 'rid',
};

const tables = [];

for (const [tableName, key] of Object.entries(tableKeyMap)) {
    tables.push({
        TableName: tableName,
        KeySchema: [{ AttributeName: key, KeyType: 'HASH' }],
        AttributeDefinitions: [{ AttributeName: key, AttributeType: 'S' }],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
    });
}

module.exports = {
    tables,
    basePort: 8000,
};
