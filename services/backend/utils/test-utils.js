const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const Promise = require('bluebird');

const tableKeysMap = dynamoUtils.PKEYS;

async function clearTables(tables = undefined) {
    if (!tables) tables = _.values(dynamoUtils.TABLES);
    const itemsByTable = {};

    await Promise.map(tables, async table => {
        itemsByTable[table] = (await dynamoUtils.scan({ TableName: table, AutoPaginate: true })).Items;
    });

    const requests = _.mapValues(itemsByTable, (items, table) => {
        const pks = tableKeysMap[table];
        return items.map(item => ({ DeleteRequest: { Key: _.pick(item, _.flatten([pks])) } }));
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
