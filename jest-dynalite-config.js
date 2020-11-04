const tableKeysMap = {
    users: ['uid'],
    terms: ['tid'],
    courses: ['cid'],
    holidays: ['hid'],
    sections: ['sid'],
    assignments: ['aid'],
    tasks: ['tid'],
    reminders: ['rid', 'eid'],
};

const tables = [];

for (const [tableName, keys] of Object.entries(tableKeysMap)) {
    tables.push({
        TableName: tableName,
        KeySchema: keys.map((key, i) => ({ AttributeName: key, KeyType: i ? 'RANGE' : 'HASH' })),
        AttributeDefinitions: keys.map(key => ({ AttributeName: key, AttributeType: 'S' })),
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
    });
}

module.exports = {
    tables,
    basePort: 8000,
};
