const _ = require('lodash');
const { v4: uuid } = require('lodash');

const jsonMock = jest.fn();

jest.doMock('@logan/aws', () => {
    const mocked = jest.requireActual('@logan/aws');
    mocked.secretUtils.getSecret = async () => ({ web: 'mock-secret' });
    return mocked;
});

const { dynamoUtils } = require('@logan/aws');
const testUtils = require('../utils/test-utils');
const usersController = require('./src/users-controller');
const tasksController = require('./src/tasks-controller');
const assignmentsController = require('./src/assignments-controller');
const termsController = require('./src/terms-controller');
const holidaysController = require('./src/holidays-controller');
const coursesController = require('./src/courses-controller');
const sectionsController = require('./src/sections-controller');

describe('Assignments', () => {
    // Create two assignments
    // Create 100 tasks for the assignment to delete (this also checks that batchWrite is paginating correctly)
    // Create 1 task for the other assignment
    // Delete assignment
    // Check that only the other assignment's task remains
});

describe('Courses', () => {
    // Create two courses
    // Create one section in each
    // Create one assignment in each
    // Create a task for each of those assignments
    // Create a task for each course unrelated to an assignment
    // Delete one of the courses
    // Check that all the entities for that course are gone
    // Check that all the entities for the other course remain
});

describe('Terms', () => {
    // Create two terms
    // Create one course in each
    // Create one holiday in each
    // Create one section in each course
    // Create one assignment in each course
    // Delete one of the terms, and ensure only the other term's entities remain
});

describe('Users', () => {
    // Create two users
    // Create one term for each
    // Create some courses, holidays, sections, assignments, tasks for each
    // Delete one user
    // Check that only the other user's stuff remains
});
