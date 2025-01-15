const _ = require('lodash');
const testUtils = require('../../utils/test-utils');

jest.doMock('../../utils/auth', () => {
    const mocked = jest.requireActual('../../utils/auth');
    mocked.handleAuth = () => {};
    return mocked;
});

// Mock packages/aws
jest.doMock('packages/aws', () => {
    const mocked = jest.requireActual('packages/aws');
    mocked.secretUtils.getSecret = async () => ({ web: 'mock-secret' });
    return mocked;
});

const basicUser1 = {
    uid: 'abc123',
    username: 'basicuser1',
    name: 'Basic User1',
    email: 'basicuser1@gmail.com',
    primaryColor: 'teal',
    accentColor: 'deepOrange',
};

const basicUser2 = {
    uid: '123abc',
    username: 'basicuser2',
    name: 'Basic User2',
    email: 'basicuser2@gmail.com',
    primaryColor: 'red',
    accentColor: 'blue',
};

// eslint-disable-next-line import/order
const { dynamoUtils } = require('packages/aws');
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
        const event = {
            pathParameters: _.pick(basicUser1, ['uid']),
            auth: basicUser2,
        };

        const response = await usersController.getUser(event);

        expect(JSON.parse(response.body)).toEqual(expect.objectContaining(basicUser1));
    });

    it('Fetching a nonexistent user fails', async () => {
        const event = {
            pathParameters: { uid: 'doesnt-exist' },
            auth: basicUser1,
        };

        const response = await usersController.getUser(event);
        expect(response.statusCode).toEqual(500);
    });
});

describe('createUser', () => {
    beforeAll(async () => testUtils.clearTables());

    it('Creating a normal user succeeds', async () => {
        const requestBody = _.pick(basicUser1, ['name', 'email', 'username']);

        const response = await usersController.createUser({ body: requestBody });

        expect(JSON.parse(response.body)).toEqual(
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
                expect.objectContaining(
                    _.pick(usersController.__test_only__.toDbFormat(basicUser1), ['name', 'username', 'email'])
                ),
            ])
        );
    });

    it('Missing required properties fails', async () => {
        await testUtils.clearTable('users');

        const baseUser = _.omit(basicUser1, ['uid']);

        // Require name
        const nameResponse = await usersController.createUser({ body: _.omit(baseUser, ['name']) });
        expect(nameResponse.statusCode).toEqual(500);
        expect(nameResponse.body).toContain('required');

        // Require username
        const unameResponse = await usersController.createUser({ body: _.omit(baseUser, ['username']) });
        expect(unameResponse.statusCode).toEqual(500);
        expect(unameResponse.body).toContain('required');

        // Require email
        const emailResponse = await usersController.createUser({ body: _.omit(baseUser, ['email']) });
        expect(emailResponse.statusCode).toEqual(500);
        expect(emailResponse.body).toContain('required');
    });

    it('Attempting to create a non-unique user fails', async () => {
        await testUtils.clearTable('users');
        const baseUser = _.omit(basicUser1, ['uid']);
        await usersController.createUser({ body: baseUser });
        const response = await usersController.createUser({ body: baseUser });
        expect(response.statusCode).toEqual(500);
        expect(response.body).toContain('unique');
    });
});

describe('updateUser', () => {
    it('Updating yourself succeeds', async () => {
        const updatedUser = _.merge({}, basicUser1, { username: 'updated' });
        const event = {
            pathParameters: _.pick(basicUser1, ['uid']),
            auth: basicUser1,
            body: updatedUser,
        };

        const response = await usersController.updateUser(event);

        expect(JSON.parse(response.body)).toMatchObject(updatedUser);
    });

    it('Updating another user fails', async () => {
        const event = {
            pathParameters: _.pick(basicUser2, ['uid']),
            auth: basicUser1,
        };

        const response = await usersController.updateUser(event);

        expect(response.statusCode).toEqual(500);
    });
});

describe('deleteUser', () => {
    beforeEach(async () => testUtils.clearTable('users'));

    it('Deleting yourself should not fail', async () => {
        await usersController.createUser({ body: basicUser1 });
        const { Items: beforeDelete } = await dynamoUtils.scan({ TableName: 'users' });
        expect(beforeDelete).toHaveLength(1);
        const createdUid = beforeDelete[0].uid;

        await usersController.deleteUser({ auth: { uid: createdUid }, pathParameters: { uid: createdUid } });

        const { Items: users } = await dynamoUtils.scan({ TableName: 'users' });
        expect(users).toHaveLength(0);
    });

    it('Deleting another user should fail', async () => {
        const response = await usersController.deleteUser({ auth: basicUser1, pathParameters: basicUser2 });
        expect(response.statusCode).toEqual(500);
    });
});
