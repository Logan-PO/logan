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

const basicAssignment1 = {
    aid: 'abc123',
    uid: 'usr123',
    title: 'assignment1',
    cid: 'cid123',
    description: 'basic assignment 1',
    dueDate: '1/30/21',
};

const basicAssignment2 = {
    aid: 'abc321',
    uid: 'usr123',
    title: 'assignment2',
    cid: 'cid321',
    description: 'basic assignment 2',
    dueDate: '1/31/21',
};

const assignmentsController = require('./assignments-controller');

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

describe('getAssignment', () => {
    it('Basic fetch returns the correct assignment', async () => {
        const req = {
            params: { aid: 'abc123' },
        };
        const dbFormat = {
            aid: 'abc123',
            uid: 'usr123',
            title: 'assignment1',
            cid: 'cid123',
            desc: 'basic assignment 1',
            due: '1/30/21',
        };

        mockDbGet.mockReturnValueOnce({ Item: dbFormat });

        await assignmentsController.getAssignment(req, { json: jsonMock });

        expect(mockDbGet).toHaveBeenCalledTimes(1);
        expect(jsonMock).toHaveBeenCalledWith(basicAssignment1);
    });

    it('Fetching a nonexistent assignment fails', async () => {
        const req = {
            params: { aid: 'doesnt-exist' },
        };

        mockDbGet.mockReturnValueOnce({ Item: undefined });

        await expect(assignmentsController.getAssignment(req, { json: jsonMock })).rejects.toThrowError(
            'Assignment does not exist'
        );
        expect(mockDbGet).toHaveBeenCalledTimes(1);
    });
});

describe('getAssignments', () => {
    it('Basic fetch returns correct assignments', async () => {
        const req = {
            params: { uid: 'usr123' },
        };

        //mockDbScan.mockReturnValueOnce({ Count: 2 });
        mockDbScan.mockReturnValueOnce({ Items: basicAssignment1, basicAssignment2 });

        await assignmentsController.getAssignments(req, { json: jsonMock });

        expect(mockDbScan).toHaveBeenCalledTimes(1);
        expect(jsonMock).toHaveBeenCalledWith(basicAssignment1, basicAssignment2);
    });
});

describe('createAssignment', () => {
    it('Creating a normal assignment succeeds', async () => {
        const requestBody = _.omit(basicAssignment1, ['aid']);

        await assignmentsController.createAssignment({ body: requestBody }, { json: jsonMock });

        expect(mockDbPut).toHaveBeenCalledTimes(1);
        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
                aid: expect.anything(),
                ...requestBody,
            })
        );
    });

    it('Missing required properties fails', async () => {
        const baseAssignment = _.omit(basicAssignment1, ['aid']);

        // Require title
        await expect(
            assignmentsController.createAssignment({ body: _.omit(baseAssignment, ['title']) })
        ).rejects.toThrow('required');

        // Require dueDate
        await expect(
            assignmentsController.createAssignment({ body: _.omit(baseAssignment, ['dueDate']) })
        ).rejects.toThrow('required');
    });
});

describe('updateAssignment', () => {
    it('Update successful', async () => {
        const updatedAssignment = _.merge({}, basicAssignment1, { title: 'updated' });
        const req = {
            params: _.pick(basicAssignment1, ['aid']),
            body: updatedAssignment,
        };

        await assignmentsController.updateAssignment(req, { json: jsonMock });

        expect(mockDbPut).toHaveBeenCalledTimes(1);
        expect(jsonMock).toHaveBeenCalledWith(updatedAssignment);
    });
});

describe('deleteAssignment', () => {
    it('Successful delete', async () => {
        await assignmentsController.deleteAssignment({ params: basicAssignment1 }, { json: jsonMock });
        expect(mockDbDelete).toHaveBeenCalledTimes(2);
    });
});
