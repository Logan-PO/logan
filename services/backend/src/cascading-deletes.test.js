const { v4: uuid } = require('uuid');
const dayjs = require('dayjs');

const jsonMock = jest.fn();

jest.doMock('@logan/aws', () => {
    const mocked = jest.requireActual('@logan/aws');
    mocked.secretUtils.getSecret = async () => ({ web: 'mock-secret' });
    return mocked;
});

const { dynamoUtils } = require('@logan/aws');
const testUtils = require('../utils/test-utils');
const usersController = require('./users-controller');
const tasksController = require('./tasks-controller');
const assignmentsController = require('./assignments-controller');
const termsController = require('./terms-controller');
const holidaysController = require('./holidays-controller');
const coursesController = require('./courses-controller');
const sectionsController = require('./sections-controller');

const assignment = assignmentsController.__test_only__;
const task = tasksController.__test_only__;
const course = coursesController.__test_only__;
const section = sectionsController.__test_only__;
const term = termsController.__test_only__;
const holiday = holidaysController.__test_only__;
const user = usersController.__test_only__;

beforeAll(async () => testUtils.clearAllTables());

describe('Assignments', () => {
    let basicAssignment1, basicAssignment2;
    let tasks, basicTask1;

    beforeAll(async () => {
        // Create two assignments
        basicAssignment1 = {
            aid: 'abc123',
            uid: 'usr123',
            title: 'assignment1',
            cid: 'cid123',
            desc: 'basic assignment 1',
            due: '1/30/21',
        };

        basicAssignment2 = {
            aid: 'abc321',
            uid: 'usr123',
            title: 'assignment2',
            cid: 'cid321',
            desc: 'basic assignment 2',
            due: '1/31/21',
        };

        await dynamoUtils.batchWrite(
            dynamoUtils.TABLES.ASSIGNMENTS,
            [basicAssignment1, basicAssignment2].map(a => ({ PutRequest: { Item: a } }))
        );

        // Create 100 tasks for the assignment to delete (this also checks that batchWrite is paginating correctly)
        tasks = [];
        for (let i = 0; i < 100; i++) {
            tasks.push({
                uid: 'usr123',
                tid: uuid(),
                title: 'task 1',
                aid: basicAssignment1.aid,
                desc: 'problem 1',
                due: '1/30/21',
                pri: 2,
            });
        }

        // Create 1 task for the other assignment
        basicTask1 = {
            uid: 'usr123',
            tid: 'tid123',
            title: 'task 1',
            aid: basicAssignment2.aid,
            desc: 'problem 1',
            due: '1/30/21',
            pri: 2,
            cmp: false,
        };

        tasks.push(basicTask1);

        await dynamoUtils.batchWrite(
            dynamoUtils.TABLES.TASKS,
            tasks.map(task => ({ PutRequest: { Item: task } }))
        );
    });

    afterAll(async () => {
        await testUtils.clearTable(dynamoUtils.TABLES.TASKS);
        await testUtils.clearTable(dynamoUtils.TABLES.ASSIGNMENTS);
    });

    // Delete assignment
    it('Successful delete', async () => {
        await assignmentsController.deleteAssignment(
            { params: { aid: basicAssignment1.aid }, auth: { uid: basicAssignment1.uid } },
            { json: jsonMock }
        );
        // Check that only the other assignment's task remains
        const { Items: remainingAssignments } = await dynamoUtils.scan({ TableName: dynamoUtils.TABLES.ASSIGNMENTS });
        expect(remainingAssignments).toHaveLength(1);
        expect(remainingAssignments[0]).toEqual(basicAssignment2);

        const { Items: remainingTasks } = await dynamoUtils.scan({ TableName: dynamoUtils.TABLES.TASKS });
        expect(remainingTasks).toHaveLength(1);
        expect(remainingTasks[0]).toEqual(basicTask1);
    });
});

describe('Courses', () => {
    // Create two courses
    const basicCourse1 = {
        uid: 'usr123',
        tid: 'term1',
        cid: 'cid123',
        title: 'course 1',
        nickname: 'nickname1',
        color: 'blue',
    };

    const basicCourse2 = {
        uid: 'usr123',
        tid: 'term2',
        cid: 'cid321',
        title: 'course 2',
        nickname: 'nickname2',
        color: 'red',
    };

    // Create one section in each
    const basicSection1 = {
        uid: 'usr123',
        cid: 'cid123',
        sid: 'sid123',
        title: 'section 1',
        startDate: dayjs('Jan 1 2020'),
        endDate: dayjs('Jan 2 2020'),
        startTime: dayjs('Jan 1 2020'),
        endTime: dayjs('Jan 1 2020'),
        daysOfWeek: 'mwf',
        weeklyRepeat: 'tbd',
        location: 'tbd',
        instructor: 'Connamacher',
    };

    const basicSection2 = {
        uid: 'usr123',
        cid: 'cid321',
        sid: 'sid321',
        title: 'section 2',
        startDate: dayjs('Jan 1 2020'),
        endDate: dayjs('Jan 2 2020'),
        startTime: dayjs('Jan 1 2020'),
        endTime: dayjs('Jan 1 2020'),
        daysOfWeek: 'mwf',
        weeklyRepeat: 'tbd',
        location: 'tbd',
        instructor: 'Connamacher',
    };

    // Create one assignment in each
    const basicAssignment1 = {
        aid: 'aid123',
        uid: 'usr123',
        title: 'assignment1',
        cid: 'cid123',
        description: 'basic assignment 1',
        dueDate: '1/30/21',
    };

    const basicAssignment2 = {
        aid: 'aid321',
        uid: 'usr123',
        title: 'assignment2',
        cid: 'cid321',
        description: 'basic assignment 2',
        dueDate: '1/31/21',
    };

    // Create a task for each of those assignments
    const basicTask1 = {
        uid: 'usr123',
        tid: 'tid292309432',
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
        tid: 'tid391230912',
        title: 'task 1',
        aid: 'aid321',
        cid: 'cid321',
        description: 'problem 2',
        dueDate: '1/30/21',
        priority: 'high',
        complete: 'no',
    };

    // Create a task for each course unrelated to an assignment
    const basicTask3 = {
        uid: 'usr123',
        tid: 'tid9423023',
        title: 'task 1',
        aid: null,
        cid: 'cid123',
        description: 'unrelated',
        dueDate: '1/30/21',
        priority: 'high',
        complete: 'no',
    };

    const basicTask4 = {
        uid: 'usr123',
        tid: 'tid204324854',
        title: 'task 1',
        aid: null,
        cid: 'cid321',
        description: 'unrelated',
        dueDate: '1/30/21',
        priority: 'high',
        complete: 'no',
    };

    beforeAll(async () => {
        await dynamoUtils.put({
            TableName: 'courses',
            Item: course.toDbFormat(basicCourse1),
        });
        await dynamoUtils.put({
            TableName: 'courses',
            Item: course.toDbFormat(basicCourse2),
        });
        await dynamoUtils.put({
            TableName: 'sections',
            Item: section.toDbFormat(basicSection1),
        });
        await dynamoUtils.put({
            TableName: 'sections',
            Item: section.toDbFormat(basicSection2),
        });
        await dynamoUtils.put({
            TableName: 'assignments',
            Item: assignment.toDbFormat(basicAssignment1),
        });
        await dynamoUtils.put({
            TableName: 'assignments',
            Item: assignment.toDbFormat(basicAssignment2),
        });
        await dynamoUtils.put({
            TableName: 'tasks',
            Item: task.toDbFormat(basicTask1),
        });
        await dynamoUtils.put({
            TableName: 'tasks',
            Item: task.toDbFormat(basicTask2),
        });
        await dynamoUtils.put({
            TableName: 'tasks',
            Item: task.toDbFormat(basicTask3),
        });
        await dynamoUtils.put({
            TableName: 'tasks',
            Item: task.toDbFormat(basicTask4),
        });
    });

    afterAll(async () => testUtils.clearTable('courses'));
    afterAll(async () => testUtils.clearTable('sections'));
    afterAll(async () => testUtils.clearTable('assignments'));
    afterAll(async () => testUtils.clearTable('tasks'));

    // Delete one of the courses
    it('Successful delete', async () => {
        await coursesController.deleteCourse({ params: basicCourse1, auth: { uid: 'usr123' } }, { json: jsonMock });

        // Check that all the entities for that course are gone
        const { Items, Count } = await dynamoUtils.scan({ TableName: 'courses' });
        expect(Count).toEqual(1);
        expect(Items[0]).toEqual(course.toDbFormat(basicCourse2));
    });

    // Check that all the entities for the other course remain
});

describe('Terms', () => {
    // Create two terms
    const basicTerm1 = {
        uid: 'usr123',
        tid: 'term1',
        title: 'fall',
        startDate: dayjs(),
        endDate: dayjs(),
    };

    const basicTerm2 = {
        uid: 'usr123',
        tid: 'term2',
        title: 'spring',
        startDate: dayjs(),
        endDate: dayjs(),
    };

    // Create one course in each
    const basicCourse1 = {
        uid: 'usr123',
        tid: 'term1',
        cid: 'cid123',
        title: 'course 1',
        nickname: 'nickname1',
        color: 'blue',
    };

    const basicCourse2 = {
        uid: 'usr123',
        tid: 'term2',
        cid: 'cid321',
        title: 'course 2',
        nickname: 'nickname2',
        color: 'red',
    };

    // Create one holiday in each
    const basicHoliday1 = {
        uid: 'usr123',
        tid: 'term1',
        hid: 'hid123',
        title: 'term holiday',
        startDate: dayjs(),
        endDate: dayjs(),
    };

    const basicHoliday2 = {
        uid: 'usr123',
        tid: 'term2',
        hid: 'hid321',
        title: 'term holiday',
        startDate: dayjs(),
        endDate: dayjs(),
    };

    // Create one section in each course
    const basicSection1 = {
        uid: 'usr123',
        cid: 'cid123',
        sid: 'sid123',
        title: 'section 1',
        startDate: dayjs('Jan 1 2020'),
        endDate: dayjs('Jan 2 2020'),
        startTime: dayjs('Jan 1 2020'),
        endTime: dayjs('Jan 1 2020'),
        daysOfWeek: 'mwf',
        weeklyRepeat: 'tbd',
        location: 'tbd',
        instructor: 'Connamacher',
    };

    const basicSection2 = {
        uid: 'usr123',
        cid: 'cid321',
        sid: 'sid321',
        title: 'section 2',
        startDate: dayjs('Jan 1 2020'),
        endDate: dayjs('Jan 2 2020'),
        startTime: dayjs('Jan 1 2020'),
        endTime: dayjs('Jan 1 2020'),
        daysOfWeek: 'mwf',
        weeklyRepeat: 'tbd',
        location: 'tbd',
        instructor: 'Connamacher',
    };

    // Create one assignment in each course
    const basicAssignment1 = {
        aid: 'aid123',
        uid: 'usr123',
        title: 'assignment1',
        cid: 'cid123',
        description: 'basic assignment 1',
        dueDate: '1/30/21',
    };

    const basicAssignment2 = {
        aid: 'aid321',
        uid: 'usr123',
        title: 'assignment2',
        cid: 'cid321',
        description: 'basic assignment 2',
        dueDate: '1/31/21',
    };

    beforeAll(async () => {
        await dynamoUtils.put({
            TableName: 'terms',
            Item: term.toDbFormat(basicTerm1),
        });
        await dynamoUtils.put({
            TableName: 'terms',
            Item: term.toDbFormat(basicTerm2),
        });
        await dynamoUtils.put({
            TableName: 'courses',
            Item: course.toDbFormat(basicCourse1),
        });
        await dynamoUtils.put({
            TableName: 'courses',
            Item: course.toDbFormat(basicCourse2),
        });
        await dynamoUtils.put({
            TableName: 'holidays',
            Item: holiday.toDbFormat(basicHoliday1),
        });
        await dynamoUtils.put({
            TableName: 'holidays',
            Item: holiday.toDbFormat(basicHoliday2),
        });
        await dynamoUtils.put({
            TableName: 'sections',
            Item: section.toDbFormat(basicSection1),
        });
        await dynamoUtils.put({
            TableName: 'sections',
            Item: section.toDbFormat(basicSection2),
        });
        await dynamoUtils.put({
            TableName: 'assignments',
            Item: assignment.toDbFormat(basicAssignment1),
        });
        await dynamoUtils.put({
            TableName: 'assignments',
            Item: assignment.toDbFormat(basicAssignment2),
        });
    });

    afterAll(async () => testUtils.clearTable('courses'));
    afterAll(async () => testUtils.clearTable('sections'));
    afterAll(async () => testUtils.clearTable('assignments'));
    afterAll(async () => testUtils.clearTable('terms'));
    afterAll(async () => testUtils.clearTable('holidays'));

    // Delete one of the terms, and ensure only the other term's entities remain
    it('Successful delete', async () => {
        await termsController.deleteTerm({ params: basicTerm1, auth: { uid: 'usr123' } }, { json: jsonMock });

        const { Items, Count } = await dynamoUtils.scan({ TableName: 'terms' });
        expect(Count).toEqual(1);
        expect(Items[0]).toEqual(course.toDbFormat(basicTerm2));
    });
});

describe('Users', () => {
    // Create two users
    const basicUser1 = {
        uid: 'usr123',
        name: 'name1',
        email: 'email1',
        username: 'un123',
    };

    const basicUser2 = {
        uid: 'usr321',
        name: 'name2',
        email: 'email2',
        username: 'un321',
    };

    // Create one term for each
    const basicTerm1 = {
        uid: 'usr123',
        tid: 'term1',
        title: 'fall',
        startDate: dayjs(),
        endDate: dayjs(),
    };

    const basicTerm2 = {
        uid: 'usr321',
        tid: 'term2',
        title: 'spring',
        startDate: dayjs(),
        endDate: dayjs(),
    };

    // Create some courses, holidays, sections, assignments, tasks for each
    beforeAll(async () => {
        await dynamoUtils.put({
            TableName: 'users',
            Item: user.toDbFormat(basicUser1),
        });
        await dynamoUtils.put({
            TableName: 'users',
            Item: user.toDbFormat(basicUser2),
        });
        await dynamoUtils.put({
            TableName: 'terms',
            Item: term.toDbFormat(basicTerm1),
        });
        await dynamoUtils.put({
            TableName: 'terms',
            Item: term.toDbFormat(basicTerm2),
        });
    });

    afterAll(async () => testUtils.clearTable('users'));
    afterAll(async () => testUtils.clearTable('terms'));

    // Delete one user
    it('Successful delete', async () => {
        await usersController.deleteUser({ params: basicUser1, auth: { uid: 'usr123' } }, { json: jsonMock });

        // Check that all the entities for that course are gone
        const { Items, Count } = await dynamoUtils.scan({ TableName: 'users' });
        expect(Count).toEqual(1);
        expect(Items[0]).toEqual(user.toDbFormat(basicUser2));
    });
    // Check that only the other user's stuff remains
});
