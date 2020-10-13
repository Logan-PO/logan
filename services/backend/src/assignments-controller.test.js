const _ = require('lodash');

const jsonMock = jest.fn();

// Mock @logan/aws
jest.doMock('@logan/aws', () => {
    const mocked = jest.requireActual('@logan/aws');
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

const { dynamoUtils } = require('@logan/aws');
const testUtils = require('../utils/test-utils');
const assignmentsController = require('./assignments-controller');

const { toDbFormat } = assignmentsController.__test_only__;

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

describe('getAssignment', () => {
    beforeAll(async () => {
        await dynamoUtils.put({
            TableName: 'assignments',
            Item: toDbFormat(basicAssignment1),
        });
    });

    afterAll(async () => testUtils.clearTable('assignments'));

    it('Basic fetch returns the correct assignment', async () => {
        const req = {
            params: { aid: 'abc123' },
        };

        await assignmentsController.getAssignment(req, { json: jsonMock });

        expect(jsonMock).toHaveBeenCalledWith(basicAssignment1);
    });

    it('Fetching a nonexistent assignment fails', async () => {
        const req = {
            params: { aid: 'doesnt-exist' },
        };

        await expect(assignmentsController.getAssignment(req, { json: jsonMock })).rejects.toThrowError(
            'AssignmentCell does not exist'
        );
    });
});

describe('getAssignments', () => {
    beforeAll(async () => {
        await dynamoUtils.put({
            TableName: 'assignments',
            Item: toDbFormat(basicAssignment1),
        });

        await dynamoUtils.put({
            TableName: 'assignments',
            Item: toDbFormat(basicAssignment2),
        });
    });

    afterAll(async () => testUtils.clearTable('assignments'));

    it('Basic fetch returns correct assignments', async () => {
        const req = {
            auth: { uid: 'usr123' },
        };

        await assignmentsController.getAssignments(req, { json: jsonMock });

        expect(jsonMock).toHaveBeenCalledWith(expect.arrayContaining([basicAssignment1, basicAssignment2]));
        expect(jsonMock.mock.calls[0][0]).toHaveLength(2);
    });
});

describe('createAssignment', () => {
    afterEach(async () => testUtils.clearTable('assignments'));

    it('Creating a normal assignment succeeds', async () => {
        const requestBody = _.omit(basicAssignment1, ['aid']);

        await assignmentsController.createAssignment({ body: requestBody }, { json: jsonMock });

        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
                aid: expect.anything(),
                ...requestBody,
            })
        );

        const newAid = jsonMock.mock.calls[0][0].aid;
        await expect(dynamoUtils.get({ TableName: 'assignments', Key: { aid: newAid } })).resolves.toBeDefined();
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
    beforeAll(async () => {
        await dynamoUtils.put({
            TableName: 'assignments',
            Item: toDbFormat(basicAssignment1),
        });
    });

    afterAll(async () => testUtils.clearTable('assignments'));

    it('Update successful', async () => {
        const updatedAssignment = _.merge({}, basicAssignment1, { title: 'updated' });
        const req = {
            params: _.pick(basicAssignment1, ['aid']),
            body: updatedAssignment,
            auth: { uid: 'usr123' },
        };

        await assignmentsController.updateAssignment(req, { json: jsonMock });

        expect(jsonMock).toHaveBeenCalledWith(updatedAssignment);
    });
});

describe('deleteAssignment', () => {
    beforeAll(async () => {
        await dynamoUtils.put({
            TableName: 'assignments',
            Item: toDbFormat(basicAssignment1),
        });
    });

    afterAll(async () => testUtils.clearTable('assignments'));

    it('Successful delete', async () => {
        await assignmentsController.deleteAssignment(
            { params: basicAssignment1, auth: { uid: 'usr123' } },
            { json: jsonMock }
        );

        const { Count } = await dynamoUtils.scan({ TableName: 'assignments' });
        expect(Count).toEqual(0);
    });
});
