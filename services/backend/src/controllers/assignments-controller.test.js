const _ = require('lodash');

// Mock packages/aws
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

const basicAssignment1 = {
    aid: 'abc123',
    uid: 'usr123',
    title: 'assignment1',
    cid: 'cid123',
    description: 'basic assignment 1',
    dueDate: '2021-1-30',
};

const basicAssignment2 = {
    aid: 'abc321',
    uid: 'usr123',
    title: 'assignment2',
    cid: 'cid321',
    description: 'basic assignment 2',
    dueDate: '2021-1-31',
};

const testUtils = require('../../utils/test-utils');
const assignmentsController = require('./assignments-controller');
const { dynamoUtils } = require('packages/aws');

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
        const event = {
            pathParameters: { aid: 'abc123' },
        };

        const response = await assignmentsController.getAssignment(event);

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.body)).toEqual(expect.objectContaining(basicAssignment1));
    });

    it('Fetching a nonexistent assignment fails', async () => {
        const event = {
            pathParameters: { aid: 'doesnt-exist' },
        };

        const result = await assignmentsController.getAssignment(event);
        expect(result.statusCode).toEqual(500);
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
        const event = {
            auth: { uid: 'usr123' },
        };

        const response = await assignmentsController.getAssignments(event);

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.body)).toEqual(
            expect.arrayContaining([
                expect.objectContaining(basicAssignment1),
                expect.objectContaining(basicAssignment2),
            ])
        );
    });
});

describe('createAssignment', () => {
    afterEach(async () => testUtils.clearTable('assignments'));

    it('Creating a normal assignment succeeds', async () => {
        const requestBody = _.omit(basicAssignment1, ['aid']);

        const response = await assignmentsController.createAssignment({ body: requestBody });
        const parsedBody = JSON.parse(response.body);

        expect(parsedBody).toEqual(
            expect.objectContaining({
                aid: expect.anything(),
                ...requestBody,
            })
        );

        const newAid = parsedBody.aid;
        await expect(dynamoUtils.get({ TableName: 'assignments', Key: { aid: newAid } })).resolves.toBeDefined();
    });

    it('Missing required properties fails', async () => {
        const baseAssignment = _.omit(basicAssignment1, ['aid']);

        // Require title
        const response = await assignmentsController.createAssignment({ body: _.omit(baseAssignment, ['title']) });
        expect(response.statusCode).toEqual(500);
        expect(response.body).toContain('required');

        // Require dueDate
        const response2 = await assignmentsController.createAssignment({ body: _.omit(baseAssignment, ['dueDate']) });
        expect(response2.statusCode).toEqual(500);
        expect(response2.body).toContain('required');
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
        const event = {
            pathParamters: _.pick(basicAssignment1, ['aid']),
            body: updatedAssignment,
            auth: { uid: 'usr123' },
        };

        const response = await assignmentsController.updateAssignment(event);
        const parsedBody = JSON.parse(response.body);

        expect(parsedBody).toEqual(expect.objectContaining(updatedAssignment));
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
        await assignmentsController.deleteAssignment({
            pathParameters: _.pick(basicAssignment1, ['aid']),
            auth: { uid: 'usr123' },
        });

        const { Count } = await dynamoUtils.scan({ TableName: 'assignments' });
        expect(Count).toEqual(0);
    });
});
