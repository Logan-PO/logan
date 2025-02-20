const _ = require('lodash');
const { v4: uuid } = require('uuid');
const {
    dateUtils: {
        dayjs,
        constants: { DB_DATETIME_FORMAT },
    },
} = require('packages/core');

jest.doMock('packages/aws', () => {
    const mocked = jest.requireActual('packages/aws');
    mocked.secretUtils.getSecret = async () => ({ web: 'mock-secret' });
    return mocked;
});

jest.doMock('../../utils/auth', () => {
    const mocked = jest.requireActual('../../utils/auth');
    mocked.handleAuth = () => {};
    return mocked;
});

const { dynamoUtils } = require('packages/aws');
// eslint-disable-next-line import/order
const testUtils = require('../../utils/test-utils');
// eslint-disable-next-line import/order
const controller = require('./reminders-controller');

const { toDbFormat, fromDbFormat } = controller.__test_only__;

beforeAll(async () => {
    await testUtils.clearTables();
});

describe('Formatting', () => {
    it('fromDbFormat', () => {
        const db = {
            rid: 'reminderID',
            uid: 'userID',
            eid: 'entityID',
            et: 'task',
            ts: 'abc123',
            msg: 'Hello world',
        };

        const reminder = fromDbFormat(db);

        expect(reminder).toMatchObject({
            rid: 'reminderID',
            uid: 'userID',
            eid: 'entityID',
            entityType: 'task',
            timestamp: 'abc123',
            message: 'Hello world',
        });
    });

    it('toDbFormat', () => {
        const reminder = {
            rid: 'reminderID',
            uid: 'userID',
            eid: 'entityID',
            entityType: 'task',
            timestamp: 'abc123',
            message: 'Hello world',
        };

        const db = toDbFormat(reminder);

        expect(db).toMatchObject({
            rid: 'reminderID',
            uid: 'userID',
            eid: 'entityID',
            et: 'task',
            ts: 'abc123',
            msg: 'Hello world',
        });
    });
});

describe('Operations work', () => {
    let starter;
    let user;

    beforeAll(() => {
        user = {
            uid: uuid(),
        };

        starter = {
            uid: user.uid,
            eid: uuid(),
            et: 'task',
            ts: dayjs().format(DB_DATETIME_FORMAT),
            msg: 'Hello world!',
        };
    });

    beforeEach(async () => testUtils.clearTable('reminders'));

    it('createReminder', async () => {
        const reminder = fromDbFormat(starter);

        await controller.createReminder({
            body: reminder,
            auth: user,
        });

        const { Items: foundReminders } = await dynamoUtils.scan({ TableName: dynamoUtils.TABLES.REMINDERS });
        expect(foundReminders).toHaveLength(1);
        expect(foundReminders[0]).toMatchObject(_.omit(starter, 'rid'));
    });

    it('updateReminder', async () => {
        const starter2 = { ...starter, rid: uuid() };
        await dynamoUtils.put({
            TableName: dynamoUtils.TABLES.REMINDERS,
            Item: starter2,
        });

        const updated = _.merge({}, starter2, { msg: 'Hi' });

        await controller.updateReminder({
            pathParameters: _.pick(updated, 'rid'),
            body: fromDbFormat(updated),
            auth: user,
        });

        const { Items: foundReminders } = await dynamoUtils.scan({ TableName: dynamoUtils.TABLES.REMINDERS });
        expect(foundReminders).toHaveLength(1);
        expect(foundReminders[0]).toMatchObject(updated);
    });

    it('deleteReminder', async () => {
        const starter2 = { ...starter, rid: uuid() };
        await dynamoUtils.put({
            TableName: dynamoUtils.TABLES.REMINDERS,
            Item: starter2,
        });

        await controller.deleteReminder({
            pathParameters: _.pick(starter2, 'rid'),
            body: fromDbFormat(starter2),
            auth: user,
        });

        const { Items: foundReminders } = await dynamoUtils.scan({ TableName: dynamoUtils.TABLES.REMINDERS });
        expect(foundReminders).toHaveLength(0);
    });
});
