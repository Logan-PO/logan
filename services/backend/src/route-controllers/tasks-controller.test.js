const _ = require('lodash');

const mockDbGet = jest.fn(() => ({}));
const mockDbScan = jest.fn(() => ({ Items: [] }));
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

const basicTask1 = {
    uid: 'usr123',
    tid: 'tid123',
    title: 'task 1',
    aid: 'aid123',
    cid: 'cid123',
    description: 'problem 1',
    dueDate: '1/30/21',
    priority: 'high',
    complete: 'no',
};

const basicTask2 = {
    uid: 'usr123',
    tid: 'tid321',
    title: 'task 2',
    aid: 'aid123',
    cid: 'cid123',
    description: 'problem 2',
    dueDate: '1/31/21',
    priority: 'high',
    complete: 'no',
};

const tasksController = require('./tasks-controller');

const { toDbFormat } = tasksController.__test_only__;

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

describe('getTask', () => {
    it('Basic fetch returns the correct task', async () => {
        const req = {
            params: { tid: 'tid123' },
        };

        mockDbGet.mockReturnValueOnce({ Item: toDbFormat(basicTask1) });
        mockDbScan.mockReturnValueOnce({ Items: [] });

        await tasksController.getTask(req, { json: jsonMock });

        expect(mockDbGet).toHaveBeenCalledTimes(1);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining(basicTask1));
    });

    it('Fetching a nonexistent task fails', async () => {
        const req = {
            params: { tid: 'doesnt-exist' },
        };

        mockDbGet.mockReturnValueOnce({ Item: undefined });

        await expect(tasksController.getTask(req, { json: jsonMock })).rejects.toThrowError('Task does not exist');
        expect(mockDbGet).toHaveBeenCalledTimes(1);
    });
});

describe('getTasks', () => {
    it('Basic fetch returns correct tasks', async () => {
        const req = {
            auth: { uid: 'usr123' },
        };

        mockDbScan.mockImplementation(({ TableName }) => {
            if (TableName === 'tasks') return { Items: [toDbFormat(basicTask1), toDbFormat(basicTask2)] };
            else return { Items: [] };
        });

        await tasksController.getTasks(req, { json: jsonMock });

        expect(jsonMock).toHaveBeenCalledWith([
            expect.objectContaining(basicTask1),
            expect.objectContaining(basicTask2),
        ]);
    });
});

describe('createTask', () => {
    it('Creating a normal task succeeds', async () => {
        const requestBody = _.omit(basicTask1, ['tid']);

        await tasksController.createTask({ body: requestBody }, { json: jsonMock });

        expect(mockDbPut).toHaveBeenCalledTimes(1);
        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
                tid: expect.anything(),
                ...requestBody,
            })
        );
    });

    it('Missing required properties fails', async () => {
        const baseTask = _.omit(basicTask1, ['tid']);

        // Require title
        await expect(tasksController.createTask({ body: _.omit(baseTask, ['title']) })).rejects.toThrow('required');

        // Require dueDate
        await expect(tasksController.createTask({ body: _.omit(baseTask, ['dueDate']) })).rejects.toThrow('required');

        // Required priority
        // Require dueDate
        await expect(tasksController.createTask({ body: _.omit(baseTask, ['priority']) })).rejects.toThrow('required');
    });
});

describe('updateTask', () => {
    it('Update successful', async () => {
        const updatedTask = _.merge({}, basicTask1, { title: 'updated' });
        const req = {
            params: _.pick(basicTask1, ['tid']),
            body: updatedTask,
            auth: { uid: 'usr123' },
        };

        mockDbScan.mockReturnValueOnce({ Items: [] });
        await tasksController.updateTask(req, { json: jsonMock });

        expect(mockDbPut).toHaveBeenCalledTimes(1);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining(updatedTask));
    });
});

describe('deleteTask', () => {
    it('Successful delete', async () => {
        mockDbScan.mockReturnValueOnce({ Items: [] });
        await tasksController.deleteTask({ params: basicTask1, auth: 'usr123' }, { json: jsonMock });
        expect(mockDbDelete).toHaveBeenCalledTimes(1);
    });
});
