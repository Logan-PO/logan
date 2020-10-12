const { dynamoUtils } = require('@logan/aws');
const Promise = require('bluebird');

const tableKeyMap = {
    users: 'uid',
    terms: 'tid',
    courses: 'cid',
    holidays: 'hid',
    sections: 'sid',
    assignments: 'aid',
    tasks: 'tid',
};

async function clearTables(tables = undefined) {
    if (!tables) tables = Object.values(dynamoUtils.TABLES);
    await Promise.map(tables, tableName => clearTable(tableName));
}

async function clearTable(table) {
    const pk = tableKeyMap[table];
    const { Items: toDelete } = await dynamoUtils.scan({ TableName: table, AutoPaginate: true });
    if (!toDelete.length) return;
    const deleteRequests = toDelete.map(item => ({ DeleteRequest: { Key: { [pk]: item[pk] } } }));
    await dynamoUtils.batchWrite({ [table]: deleteRequests });
}

module.exports = {
    clearTables,
    clearTable,
};
