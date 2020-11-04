const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const Promise = require('bluebird');

const tableKeyMap = dynamoUtils.PKEYS;

async function clearTables(tables = undefined) {
    if (!tables) tables = _.values(dynamoUtils.TABLES);
    const itemsByTable = {};

    await Promise.map(tables, async table => {
        itemsByTable[table] = (await dynamoUtils.scan({ TableName: table, AutoPaginate: true })).Items;
    });

    const requests = _.mapValues(itemsByTable, (items, table) => {
        const pk = tableKeyMap[table];
        return items.map(item => ({ DeleteRequest: { Key: { [pk]: item[pk] } } }));
    });

    await dynamoUtils.batchWrite(requests);
}

async function clearTable(table) {
    return clearTables([table]);
}

module.exports = {
    clearTables,
    clearTable,
};
