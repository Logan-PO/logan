import _ from 'lodash';
import axios from 'axios';

const BASE_URL = 'http://logan-backend-dev.us-west-2.elasticbeanstalk.com';
const LOCAL_URL = 'http://localhost:3000';

const STASH_KEY = 'stashedBearer';

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let bearer;

async function onStartup() {
    if (hasStashedBearer()) setBearerToken(localStorage.getItem(STASH_KEY), false);
    if (process.env.NODE_ENV === 'development') await searchForLocalBackend();
}

// If the backend is running locally, use that instead of the base URL
async function searchForLocalBackend() {
    try {
        const { data } = await axios.get(`${LOCAL_URL}/ping`);
        if (data.success) {
            console.log(`Using local backend at ${LOCAL_URL}`);
            client.defaults.baseURL = LOCAL_URL;
        }
        // eslint-disable-next-line no-empty
    } catch (e) {}
}

/**
 * Wraps a function with improved error logging
 * @param {function} fn - The function to wrap with error handling
 * @returns {function}
 */
function wrapWithErrorHandling(fn) {
    return async (...params) => {
        try {
            return await fn(...params);
        } catch (err) {
            if (err.response.status >= 600) {
                const method = err.response.config.method.toUpperCase();
                const route = err.response.config.url;
                const errName = err.response.data.type;
                const message = err.response.data.error;
                console.error(`${method} ${route}\n${errName}: ${message}\n`);
            }

            throw err;
        }
    };
}

function hasStashedBearer() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(STASH_KEY);
}

function setBearerToken(token, stash = true) {
    if (token) bearer = `Bearer ${token}`;
    else bearer = undefined;

    _.set(client, 'defaults.headers.common.Authorization', bearer);

    if (stash && typeof window !== 'undefined') {
        if (token) localStorage.setItem(STASH_KEY, token);
        else localStorage.removeItem(STASH_KEY);
    }
}

async function verifyIDToken({ idToken, clientType }) {
    const res = await client.post('/auth/verify', { idToken, clientType });
    return res.data;
}

async function createNewUser(data) {
    const res = await client.post('/users', { name: data.name, email: data.email, username: data.username });
    return res.data;
}

async function getUser(uid) {
    const res = await client.get(`/users/${uid}`);
    return res.data;
}

/* --- TASKS --- */

async function getTasks() {
    const response = await client.get('/tasks');
    return response.data;
}

// Returns the new task
async function createTask(task) {
    const response = await client.post('/tasks', task);
    return response.data;
}

// Returns the updated task
async function updateTask(task) {
    const { tid } = task;
    const response = await client.put(`/tasks/${tid}`, task);
    return response.data;
}

/**
 * @param task
 * @returns {Promise<{ success:boolean }>}
 */
async function deleteTask(task) {
    const { tid } = task;
    const response = await client.delete(`/tasks/${tid}`);
    return response.data;
}

/* --- TERMS --- */

async function getTerms() {
    const response = await client.get('/terms');
    return response.data;
}

// Returns the new term
async function createTerm(term) {
    const response = await client.post('/terms', term);
    return response.data;
}

// Returns the updated term
async function updateTerm(term) {
    const { tid } = term;
    const response = await client.put(`/terms/${tid}`, term);
    return response.data;
}

async function deleteTerm(term) {
    const { tid } = term;
    const response = await client.delete(`/terms/${tid}`);
    return response.data;
}

/* --- HOLIDAYS --- */

async function getHolidays() {
    const response = await client.get('/holidays');
    return response.data;
}

// Returns the new holiday
async function createHoliday(holiday) {
    const response = await client.post('/holidays', holiday);
    return response.data;
}

// Returns the updated holiday
async function updateHoliday(holiday) {
    const { hid } = holiday;
    const response = await client.put(`/holidays/${hid}`, holiday);
    return response.data;
}

async function deleteHoliday(holiday) {
    const { hid } = holiday;
    const response = await client.delete(`/holidays/${hid}`);
    return response.data;
}

/* --- COURSES --- */

async function getCourses() {
    const response = await client.get('/courses');
    return response.data;
}

// Returns the new course
async function createCourse(course) {
    const response = await client.post('/courses', course);
    return response.data;
}

// Returns the updated course
async function updateCourse(course) {
    const { cid } = course;
    const response = await client.put(`/courses/${cid}`, course);
    return response.data;
}

async function deleteCourse(course) {
    const { cid } = course;
    const response = await client.delete(`/courses/${cid}`);
    return response.data;
}

/* --- SECTIONS --- */

async function getSections() {
    const response = await client.get('/sections');
    return response.data;
}

// Returns the new course
async function createSection(section) {
    const response = await client.post('/sections', section);
    return response.data;
}

// Returns the updated course
async function updateSection(section) {
    const { sid } = section;
    const response = await client.put(`/sections/${sid}`, section);
    return response.data;
}

async function deleteSection(section) {
    const { sid } = section;
    const response = await client.delete(`/sections/${sid}`);
    return response.data;
}

async function getAssignments() {
    const response = await client.get('/assignments');
    return response.data;
}

// Returns the new assignment
async function createAssignment(assignment) {
    const response = await client.post('/assignments', assignment);
    return response.data;
}

// Returns the updated assigment
async function updateAssignment(assignment) {
    const { aid } = assignment;
    const response = await client.put(`/assignments/${aid}`, assignment);
    return response.data;
}
/**
 * @param assignment
 * @returns {Promise<{ success:boolean }>}
 */
async function deleteAssignment(assignment) {
    const { aid } = assignment;
    const response = await client.delete(`/assignments/${aid}`);
    return response.data;
}

onStartup();

export default {
    hasStashedBearer,
    setBearerToken,
    createNewUser: wrapWithErrorHandling(createNewUser),
    verifyIDToken: wrapWithErrorHandling(verifyIDToken),
    getUser: wrapWithErrorHandling(getUser),
    getTasks: wrapWithErrorHandling(getTasks),
    createTask: wrapWithErrorHandling(createTask),
    updateTask: wrapWithErrorHandling(updateTask),
    deleteTask: wrapWithErrorHandling(deleteTask),
    getTerms: wrapWithErrorHandling(getTerms),
    createTerm: wrapWithErrorHandling(createTerm),
    updateTerm: wrapWithErrorHandling(updateTerm),
    deleteTerm: wrapWithErrorHandling(deleteTerm),
    getHolidays: wrapWithErrorHandling(getHolidays),
    createHoliday: wrapWithErrorHandling(createHoliday),
    updateHoliday: wrapWithErrorHandling(updateHoliday),
    deleteHoliday: wrapWithErrorHandling(deleteHoliday),
    getCourses: wrapWithErrorHandling(getCourses),
    createCourse: wrapWithErrorHandling(createCourse),
    updateCourse: wrapWithErrorHandling(updateCourse),
    deleteCourse: wrapWithErrorHandling(deleteCourse),
    getSections: wrapWithErrorHandling(getSections),
    createSection: wrapWithErrorHandling(createSection),
    updateSection: wrapWithErrorHandling(updateSection),
    deleteSection: wrapWithErrorHandling(deleteSection),
    getAssignments: wrapWithErrorHandling(getAssignments),
    createAssignment: wrapWithErrorHandling(createAssignment),
    updateAssignment: wrapWithErrorHandling(updateAssignment),
    deleteAssignment: wrapWithErrorHandling(deleteAssignment),
};
