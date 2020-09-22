const _ = require('lodash');

const mockDbGet = jest.fn(() => ({}));
const mockDbScan = jest.fn(() => ({}));
const mockDbPut = jest.fn(() => ({}));
const mockDbDelete = jest.fn(() => ({}));
const jsonMock = jest.fn();

// Mock @logan/aws
jest.doMock('@logan/aws', () => {
    const mocked = jest.requireActual('@logan/aws');
    mocked.dynamoUtils.get = mockDbGet;
    mocked.dynamoUtils.scan = mockDbScan;
    mocked.dynamoUtils.put = mockDbPut;
    mocked.dynamoUtils.delete = mockDbDelete;
    mocked.secretUtils.getSecret = async () => ({ web: 'mock-secret' });
    return mocked;
});

const basicUser1 = {
    uid: 'abc123',
    username: 'basicuser1',
    name: 'Basic User1',
    email: 'basicuser1@gmail.com',
};

const basicUser2 = {
    uid: '123abc',
    username: 'basicuser2',
    name: 'Basic User2',
    email: 'basicuser2@gmail.com',
};

// Load users-controller.js after mocking everything
const usersController = require('./users-controller');

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

describe('getUser', () => {
    it('Basic fetch returns the correct user', async () => {
        const req = {
            params: _.pick(basicUser1, ['uid']),
            auth: basicUser2,
        };

        mockDbGet.mockReturnValueOnce({ Item: usersController.__test_only__.toDbFormat(basicUser1) });

        await usersController.getUser(req, { json: jsonMock });

        expect(mockDbGet).toHaveBeenCalledTimes(1);
        expect(jsonMock).toHaveBeenCalledWith(basicUser1);
    });

    it("Fetching yourself doesn't query Dynamo", async () => {
        const req = {
            params: _.pick(basicUser1, ['uid']),
            auth: basicUser1,
        };

        mockDbGet.mockReturnValueOnce({ Item: usersController.__test_only__.toDbFormat(basicUser1) });

        await usersController.getUser(req, { json: jsonMock });

        expect(mockDbGet).toHaveBeenCalledTimes(0);
        expect(jsonMock).toHaveBeenCalledWith(basicUser1);
    });

    it('Fetching a nonexistent user fails', async () => {
        const req = {
            params: { uid: 'doesnt-exist' },
            auth: basicUser1,
        };

        mockDbGet.mockReturnValueOnce({ Item: undefined });

        await expect(usersController.getUser(req, { json: jsonMock })).rejects.toThrowError('User does not exist');
        expect(mockDbGet).toHaveBeenCalledTimes(1);
    });
});

describe('createUser', () => {
    it('Creating a normal user succeeds', async () => {
        const requestBody = _.omit(basicUser1, ['uid']);

        mockDbScan.mockReturnValueOnce({ Items: [], Count: 0 });

        await usersController.createUser({ body: requestBody }, { json: jsonMock });
        expect(mockDbScan).toHaveBeenCalledTimes(1);
        expect(mockDbPut).toHaveBeenCalledTimes(1);
        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
                user: {
                    uid: expect.anything(),
                    ...requestBody,
                },
                bearer: expect.anything(),
            })
        );
    });

    it('Missing required properties fails', async () => {
        const baseUser = _.omit(basicUser1, ['uid']);

        // Require name
        await expect(usersController.createUser({ body: _.omit(baseUser, ['name']) })).rejects.toThrow('required');

        // Require username
        await expect(usersController.createUser({ body: _.omit(baseUser, ['username']) })).rejects.toThrow('required');

        // Require email
        await expect(usersController.createUser({ body: _.omit(baseUser, ['email']) })).rejects.toThrow('required');
    });

    it('Attempting to create a non-unique user fails', async () => {
        const baseUser = _.omit(basicUser1, ['uid']);

        mockDbScan.mockReturnValueOnce({ Count: 1 });

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

        mockDbScan.mockReturnValue({ Count: 0 });

        await usersController.updateUser(req, { json: jsonMock });

        expect(mockDbPut).toHaveBeenCalledTimes(1);
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
    it('Deleting yourself should not fail', async () => {
        await usersController.deleteUser({ auth: basicUser1, params: basicUser1 }, { json: jsonMock });
        expect(mockDbDelete).toHaveBeenCalledTimes(1);
    });

    it('Deleting another user should fail', async () => {
        await expect(usersController.deleteUser({ auth: basicUser1, params: basicUser2 })).rejects.toThrow();
    });
});
