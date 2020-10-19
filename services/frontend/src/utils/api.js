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

async function verifyIDToken(idToken) {
    const res = await client.post('/auth/verify', { idToken });
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
 * @param task
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
    getAssignments: wrapWithErrorHandling(getAssignments),
    createAssignment: wrapWithErrorHandling(createAssignment),
    updateAssignment: wrapWithErrorHandling(updateAssignment),
    deleteAssignment: wrapWithErrorHandling(deleteAssignment),
};
