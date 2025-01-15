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

const basicTask1 = {
    uid: 'usr123',
    tid: 'tid123',
    title: 'task 1',
    aid: 'aid123',
    cid: 'cid123',
    description: 'problem 1',
    dueDate: '1/30/21',
    priority: 1,
    complete: false,
};

const basicTask2 = {
    uid: 'usr123',
    tid: 'tid321',
    title: 'task 2',
    aid: 'aid123',
    cid: 'cid123',
    description: 'problem 2',
    dueDate: '1/31/21',
    priority: 1,
    complete: false,
};

const testUtils = require('../../utils/test-utils');
const tasksController = require('./tasks-controller');
const { dynamoUtils } = require('packages/aws');

const { toDbFormat } = tasksController.__test_only__;

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

describe('getTask', () => {
    beforeAll(async () => {
        await dynamoUtils.put({
            TableName: 'tasks',
            Item: toDbFormat(basicTask1),
        });
    });

    afterAll(async () => testUtils.clearTable('tasks'));

    it('Basic fetch returns the correct task', async () => {
        const event = {
            pathParameters: { tid: 'tid123' },
        };

        const response = await tasksController.getTask(event);

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.body)).toEqual(expect.objectContaining(basicTask1));
    });

    it('Fetching a nonexistent task fails', async () => {
        const event = {
            pathParameters: { tid: 'doesnt-exist' },
        };

        const response = await tasksController.getTask(event);

        expect(response.statusCode).toEqual(500);
    });
});

describe('getTasks', () => {
    beforeAll(async () => {
        await Promise.all([
            dynamoUtils.put({
                TableName: 'tasks',
                Item: toDbFormat(basicTask1),
            }),
            dynamoUtils.put({
                TableName: 'tasks',
                Item: toDbFormat(basicTask2),
            }),
        ]);
    });

    afterAll(async () => testUtils.clearTable('tasks'));

    it('Basic fetch returns correct tasks', async () => {
        const event = {
            auth: { uid: 'usr123' },
        };

        const response = await tasksController.getTasks(event);

        expect(JSON.parse(response.body)).toEqual(
            expect.arrayContaining([expect.objectContaining(basicTask1), expect.objectContaining(basicTask2)])
        );
    });
});

describe('createTask', () => {
    afterEach(async () => testUtils.clearTable('tasks'));

    it('Creating a normal task succeeds', async () => {
        const requestBody = _.omit(basicTask1, ['tid']);

        const response = await tasksController.createTask({ body: requestBody });

        expect(JSON.parse(response.body)).toEqual(
            expect.objectContaining({
                tid: expect.anything(),
                ...requestBody,
            })
        );
    });

    it('Missing required properties fails', async () => {
        const baseTask = _.omit(basicTask1, ['tid']);

        // Require title
        const t = await tasksController.createTask({ body: _.omit(baseTask, ['title']) });
        expect(t.statusCode).toEqual(500);
        expect(t.body).toContain('required');

        // Require dueDate
        const d = await tasksController.createTask({ body: _.omit(baseTask, ['dueDate']) });
        expect(d.statusCode).toEqual(500);
        expect(d.body).toContain('required');

        // Require priority
        const p = await tasksController.createTask({ body: _.omit(baseTask, ['priority']) });
        expect(p.statusCode).toEqual(500);
        expect(p.body).toContain('required');
    });
});

describe('updateTask', () => {
    beforeAll(async () => {
        await dynamoUtils.put({
            TableName: 'tasks',
            Item: toDbFormat(basicTask1),
        });
    });

    afterAll(async () => testUtils.clearTable('tasks'));

    it('Update successful', async () => {
        const updatedTask = _.merge({}, basicTask1, { title: 'updated' });
        const event = {
            pathParameters: _.pick(basicTask1, ['tid']),
            body: updatedTask,
            auth: { uid: 'usr123' },
        };

        const response = await tasksController.updateTask(event);

        expect(JSON.parse(response.body)).toEqual(expect.objectContaining(updatedTask));
    });
});

describe('deleteTask', () => {
    beforeAll(async () => {
        await dynamoUtils.put({
            TableName: 'tasks',
            Item: toDbFormat(basicTask1),
        });
    });

    afterAll(async () => testUtils.clearTable('tasks'));

    it('Successful delete', async () => {
        await tasksController.deleteTask({ pathParameters: basicTask1, auth: { uid: 'usr123' } });
        const { Count } = await dynamoUtils.scan({ TableName: 'tasks' });
        expect(Count).toEqual(0);
    });
});
