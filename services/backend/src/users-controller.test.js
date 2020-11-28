const _ = require('lodash');
const testUtils = require('../utils/test-utils');

const jsonMock = jest.fn();

// Mock @logan/aws
jest.doMock('@logan/aws', () => {
    const mocked = jest.requireActual('@logan/aws');
    mocked.secretUtils.getSecret = async () => ({ web: 'mock-secret' });
    return mocked;
});

const basicUser1 = {
    uid: 'abc123',
    username: 'basicuser1',
    name: 'Basic User1',
    email: 'basicuser1@gmail.com',
    tokens: ["tokens"],
};

const basicUser2 = {
    uid: '123abc',
    username: 'basicuser2',
    name: 'Basic User2',
    email: 'basicuser2@gmail.com',
    tokens: ["tokens"],
};

// eslint-disable-next-line import/order
const { dynamoUtils } = require('@logan/aws');
// Load users-controller.js after mocking everything
const usersController = require('./users-controller');

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

beforeAll(async () => testUtils.clearTables());

describe('getUser', () => {
    beforeAll(async () => {
        await dynamoUtils.batchWrite({
            [dynamoUtils.TABLES.USERS]: [basicUser1, basicUser2].map(user => ({
                PutRequest: { Item: usersController.__test_only__.toDbFormat(user) },
            })),
        });
    });

    afterAll(async () => testUtils.clearTable('users'));

    it('Basic fetch returns the correct user', async () => {
        const req = {
            params: _.pick(basicUser1, ['uid']),
            auth: basicUser2,
        };

        await usersController.getUser(req, { json: jsonMock });

        expect(jsonMock).toHaveBeenCalledWith(basicUser1);
    });

    it('Fetching a nonexistent user fails', async () => {
        const req = {
            params: { uid: 'doesnt-exist' },
            auth: basicUser1,
        };

        await expect(usersController.getUser(req, { json: jsonMock })).rejects.toThrowError('User does not exist');
    });
});

describe('createUser', () => {
    beforeAll(async () => testUtils.clearTables());

    it('Creating a normal user succeeds', async () => {
        const requestBody = _.omit(basicUser1, ['uid']);

        await usersController.createUser({ body: requestBody }, { json: jsonMock });

        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
                user: {
                    uid: expect.anything(),
                    ...requestBody,
                },
                bearer: expect.anything(),
            })
        );

        const { Items: users } = await dynamoUtils.scan({ TableName: 'users' });
        expect(users).toHaveLength(1);
        expect(users).toEqual(
            expect.arrayContaining([
                expect.objectContaining(usersController.__test_only__.toDbFormat(_.omit(basicUser1, ['uid']))),
            ])
        );
    });

    it('Missing required properties fails', async () => {
        await testUtils.clearTable('users');

        const baseUser = _.omit(basicUser1, ['uid']);

        // Require name
        await expect(usersController.createUser({ body: _.omit(baseUser, ['name']) })).rejects.toThrow('required');

        // Require username
        await expect(usersController.createUser({ body: _.omit(baseUser, ['username']) })).rejects.toThrow('required');

        // Require email
        await expect(usersController.createUser({ body: _.omit(baseUser, ['email']) })).rejects.toThrow('required');
    });

    it('Attempting to create a non-unique user fails', async () => {
        await testUtils.clearTable('users');
        const baseUser = _.omit(basicUser1, ['uid']);
        await usersController.createUser({ body: baseUser }, { json: jsonMock });
        await expect(usersController.createUser({ body: baseUser }, { json: jsonMock })).rejects.toThrow('unique');
    });
});

describe('updateUser', () => {
    it('Updating yourself succeeds', async () => {
        const updatedUser = _.merge({}, basicUser1, { username: 'updated' });
        const req = {
            params: _.pick(basicUser1, ['uid']),
            auth: basicUser1,
            body: updatedUser,
        };

        await usersController.updateUser(req, { json: jsonMock });

        expect(jsonMock).toHaveBeenCalledWith(updatedUser);
    });

    it('Updating another user fails', async () => {
        const req = {
            params: _.pick(basicUser2, ['uid']),
            auth: basicUser1,
        };

        await expect(usersController.updateUser(req)).rejects.toThrow();
    });
});

describe('deleteUser', () => {
    beforeEach(async () => testUtils.clearTable('users'));

    it('Deleting yourself should not fail', async () => {
        await usersController.createUser({ body: basicUser1 }, { json: jsonMock });
        const { Items: beforeDelete } = await dynamoUtils.scan({ TableName: 'users' });
        expect(beforeDelete).toHaveLength(1);
        const createdUid = beforeDelete[0].uid;

        await usersController.deleteUser(
            { auth: { uid: createdUid }, params: { uid: createdUid } },
            { json: jsonMock }
        );

        const { Items: users } = await dynamoUtils.scan({ TableName: 'users' });
        expect(users).toHaveLength(0);
    });

    it('Deleting another user should fail', async () => {
        await expect(usersController.deleteUser({ auth: basicUser1, params: basicUser2 })).rejects.toThrow();
    });
});
