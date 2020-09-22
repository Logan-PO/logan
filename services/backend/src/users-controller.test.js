const _ = require('lodash');

const mockDbGet = jest.fn();
const jsonMock = jest.fn();

// Mock @logan/aws
jest.doMock('@logan/aws', () => {
    const mocked = jest.requireActual('@logan/aws');
    mocked.dynamoUtils.get = mockDbGet;
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

describe('getUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

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

// createUser succeeds, and returns a good bearer token
// createUser fails if not unique

// updateUser succeeds
// Fails if modifying another usesr
// fails if email and username are not unique

// deleteUser succeeds
// fails if deleting another user
