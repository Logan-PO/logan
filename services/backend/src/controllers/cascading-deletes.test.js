const _ = require('lodash');
const { v4: uuid } = require('uuid');
const {
    dateUtils: { dayjs },
} = require('@logan/core');

const jsonMock = jest.fn();

jest.doMock('@logan/aws', () => {
    const mocked = jest.requireActual('@logan/aws');
    mocked.secretUtils.getSecret = async () => ({ web: 'mock-secret' });
    return mocked;
});

const { dynamoUtils } = require('@logan/aws');
const testUtils = require('../../utils/test-utils');
const controllers = require('./index');

const formatting = _.mapValues(controllers, controller => _.pick(controller, '__test_only__'));

beforeAll(async () => testUtils.clearTables());

describe('Tasks', () => {
    let basicTask1, basicTask2;
    let basicReminder1, basicReminder2;

    beforeAll(async () => {
        // Create 1 task for the other assignment
        basicTask1 = {
            uid: 'usr123',
            tid: 'tid123',
            title: 'task 1',
            desc: 'problem 1',
            due: '1/30/21',
            pri: 2,
            cmp: false,
        };

        basicTask2 = {
            uid: 'usr123',
            tid: 'tid124',
            title: 'task 1',
            desc: 'problem 1',
            due: '1/30/21',
            pri: 2,
            cmp: false,
        };

        basicReminder1 = {
            uid: 'usr123',
            rid: uuid(),
            et: 'task',
            eid: basicTask1.tid,
        };

        basicReminder2 = {
            uid: 'usr123',
            rid: uuid(),
            et: 'task',
            eid: basicTask2.tid,
        };

        await dynamoUtils.batchWrite({
            [dynamoUtils.TABLES.TASKS]: [basicTask1, basicTask2].map(t => ({ PutRequest: { Item: t } })),
            [dynamoUtils.TABLES.REMINDERS]: [basicReminder1, basicReminder2].map(r => ({ PutRequest: { Item: r } })),
        });
    });

    afterAll(async () => {
        await testUtils.clearTables(['tasks', 'reminders']);
    });

    // Delete assignment
    it('Successful delete', async () => {
        await controllers.tasks.deleteTask(
            { params: { tid: basicTask1.tid }, auth: { uid: basicTask1.uid } },
            { json: jsonMock }
        );

        // Check that only the other task's reminder remains
        const { Items: remainingReminders } = await dynamoUtils.scan({ TableName: dynamoUtils.TABLES.REMINDERS });
        expect(remainingReminders).toHaveLength(1);
        expect(remainingReminders[0]).toEqual(basicReminder2);
    });
});

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

        // Create 100 tasks for the assignment to delete (this also checks that batchWrite is paginating correctly)
        const numTasks = 10;
        tasks = [];
        for (let i = 0; i < numTasks; i++) {
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

        await dynamoUtils.batchWrite({
            [dynamoUtils.TABLES.ASSIGNMENTS]: [basicAssignment1, basicAssignment2].map(a => ({
                PutRequest: { Item: a },
            })),
            [dynamoUtils.TABLES.TASKS]: tasks.map(task => ({ PutRequest: { Item: task } })),
        });
    });

    afterAll(async () => {
        await testUtils.clearTables(['tasks', 'assignments']);
    });

    // Delete assignment
    it('Successful delete', async () => {
        await controllers.assignments.deleteAssignment(
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
    let basicCourse1, basicCourse2;
    let basicSection1, basicSection2;
    let basicAssignment1, basicAssignment2;
    let basicTask1, basicTask2, basicTask3, basicTask4;

    beforeAll(async () => {
        // Create two courses
        basicCourse1 = {
            uid: 'usr123',
            tid: 'term1',
            cid: 'cid123',
            title: 'course 1',
            nickname: 'nickname1',
            color: 'blue',
        };

        basicCourse2 = {
            uid: 'usr123',
            tid: 'term2',
            cid: 'cid321',
            title: 'course 2',
            nickname: 'nickname2',
            color: 'red',
        };

        // Create one section in each
        basicSection1 = {
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

        basicSection2 = {
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
        basicAssignment1 = {
            aid: 'aid123',
            uid: 'usr123',
            title: 'assignment1',
            cid: 'cid123',
            description: 'basic assignment 1',
            dueDate: '1/30/21',
        };

        basicAssignment2 = {
            aid: 'aid321',
            uid: 'usr123',
            title: 'assignment2',
            cid: 'cid321',
            description: 'basic assignment 2',
            dueDate: '1/31/21',
        };

        // Create a task for each of those assignments
        basicTask1 = {
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

        basicTask2 = {
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
        basicTask3 = {
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

        basicTask4 = {
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

        await dynamoUtils.batchWrite({
            courses: [basicCourse1, basicCourse2].map(course => ({
                PutRequest: {
                    Item: formatting.courses.__test_only__.toDbFormat(course),
                },
            })),
            sections: [basicSection1, basicSection2].map(section => ({
                PutRequest: {
                    Item: formatting.sections.__test_only__.toDbFormat(section),
                },
            })),
            assignments: [basicAssignment1, basicAssignment2].map(a => ({
                PutRequest: {
                    Item: formatting.assignments.__test_only__.toDbFormat(a),
                },
            })),
            tasks: [basicTask1, basicTask2, basicTask3, basicTask4].map(t => ({
                PutRequest: {
                    Item: formatting.tasks.__test_only__.toDbFormat(t),
                },
            })),
        });
    });

    afterAll(async () => {
        await testUtils.clearTables(['courses', 'sections', 'assignments', 'tasks']);
    });

    // Delete one of the courses
    it('Successful delete', async () => {
        await controllers.courses.deleteCourse({ params: basicCourse1, auth: { uid: 'usr123' } }, { json: jsonMock });

        // Check that all the entities for that course are gone
        const { Items: remainingCourses, Count: courseCount } = await dynamoUtils.scan({ TableName: 'courses' });
        expect(courseCount).toEqual(1);
        expect(remainingCourses[0]).toEqual(formatting.courses.__test_only__.toDbFormat(basicCourse2));
    });

    // Check that all the entities for the other course remain
});

describe('Terms', () => {
    let basicTerm1, basicTerm2;
    let basicCourse1, basicCourse2;
    let basicHoliday1, basicHoliday2;
    let basicSection1, basicSection2;
    let basicAssignment1, basicAssignment2;

    beforeAll(async () => {
        // Create two terms
        basicTerm1 = {
            uid: 'usr123',
            tid: 'tid123',
            title: 'fall',
            startDate: dayjs('Jan 1 2020'),
            endDate: dayjs('Jan 30 2020'),
        };

        basicTerm2 = {
            uid: 'usr123',
            tid: 'tid321',
            title: 'spring',
            startDate: dayjs('Jan 1 2020'),
            endDate: dayjs('Jan 30 2020'),
        };

        // Create one course in each
        basicCourse1 = {
            uid: 'usr123',
            tid: 'tid123',
            cid: 'cid123',
            title: 'course 1',
            nickname: 'nickname1',
            color: 'blue',
        };

        basicCourse2 = {
            uid: 'usr123',
            tid: 'tid321',
            cid: 'cid321',
            title: 'course 2',
            nickname: 'nickname2',
            color: 'red',
        };

        // Create one holiday in each
        basicHoliday1 = {
            uid: 'usr123',
            tid: 'tid123',
            hid: 'hid123',
            title: 'term holiday',
            startDate: dayjs('Jan 1 2020'),
            endDate: dayjs('Jan 1 2020'),
        };

        basicHoliday2 = {
            uid: 'usr123',
            tid: 'tid321',
            hid: 'hid321',
            title: 'term holiday',
            startDate: dayjs('Jan 1 2020'),
            endDate: dayjs('Jan 1 2020'),
        };

        // Create one section in each course
        basicSection1 = {
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

        basicSection2 = {
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
        basicAssignment1 = {
            aid: 'aid123',
            uid: 'usr123',
            title: 'assignment1',
            cid: 'cid123',
            description: 'basic assignment 1',
            dueDate: '1/30/21',
        };

        basicAssignment2 = {
            aid: 'aid321',
            uid: 'usr123',
            title: 'assignment2',
            cid: 'cid321',
            description: 'basic assignment 2',
            dueDate: '1/31/21',
        };

        await dynamoUtils.batchWrite({
            [dynamoUtils.TABLES.TERMS]: [basicTerm1, basicTerm2].map(term => ({
                PutRequest: { Item: formatting.terms.__test_only__.toDbFormat(term) },
            })),
            [dynamoUtils.TABLES.COURSES]: [basicCourse1, basicCourse2].map(course => ({
                PutRequest: { Item: formatting.courses.__test_only__.toDbFormat(course) },
            })),
            [dynamoUtils.TABLES.HOLIDAYS]: [basicHoliday1, basicHoliday2].map(holiday => ({
                PutRequest: { Item: formatting.holidays.__test_only__.toDbFormat(holiday) },
            })),
            [dynamoUtils.TABLES.SECTIONS]: [basicSection1, basicSection2].map(section => ({
                PutRequest: { Item: formatting.sections.__test_only__.toDbFormat(section) },
            })),
            [dynamoUtils.TABLES.ASSIGNMENTS]: [basicAssignment1, basicAssignment2].map(assignment => ({
                PutRequest: { Item: formatting.assignments.__test_only__.toDbFormat(assignment) },
            })),
        });
    });

    afterAll(async () => {
        await testUtils.clearTables(['courses', 'sections', 'assignments', 'terms', 'holidays']);
    });

    // Delete one of the terms, and ensure only the other term's entities remain
    it('Successful delete', async () => {
        await controllers.terms.deleteTerm({ params: basicTerm1, auth: { uid: 'usr123' } }, { json: jsonMock });

        const { Items: termsLeft, Count: termCount } = await dynamoUtils.scan({ TableName: 'terms' });
        expect(termCount).toEqual(1);
        expect(termsLeft[0]).toEqual(formatting.terms.__test_only__.toDbFormat(basicTerm2));
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
        startDate: dayjs('Jan 1 2020'),
        endDate: dayjs('Jan 30 2020'),
    };

    const basicTerm2 = {
        uid: 'usr321',
        tid: 'term2',
        title: 'spring',
        startDate: dayjs('Jan 1 2020'),
        endDate: dayjs('Jan 30 2020'),
    };

    // Create some courses, holidays, sections, assignments, tasks for each
    beforeAll(async () => {
        await dynamoUtils.batchWrite({
            users: [basicUser1, basicUser2].map(user => ({
                PutRequest: {
                    Item: formatting.users.__test_only__.toDbFormat(user),
                },
            })),
            terms: [basicTerm1, basicTerm2].map(term => ({
                PutRequest: {
                    Item: formatting.terms.__test_only__.toDbFormat(term),
                },
            })),
        });
    });

    afterAll(async () => {
        await testUtils.clearTables(['users', 'terms']);
    });

    // Delete one user
    it('Successful delete', async () => {
        await controllers.users.deleteUser({ params: basicUser1, auth: { uid: 'usr123' } }, { json: jsonMock });

        // Check that all the entities for that course are gone
        const { Items, Count } = await dynamoUtils.scan({ TableName: 'users' });
        expect(Count).toEqual(1);
        expect(Items[0]).toEqual(formatting.users.__test_only__.toDbFormat(basicUser2));
    });
    // Check that only the other user's stuff remains
});
