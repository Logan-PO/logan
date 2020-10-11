import _ from 'lodash';
import axios from 'axios';

const BASE_URL = 'http://logan-backend-dev.us-west-2.elasticbeanstalk.com';
const LOCAL_URL = 'http://localhost:3000';

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let bearer;
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

searchForLocalBackend();

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

function setBearerToken(token) {
    if (token) bearer = `Bearer ${token}`;
    else bearer = undefined;

    _.set(client, 'defaults.headers.common.Authorization', bearer);
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

export default {
    setBearerToken,
    getTasks: wrapWithErrorHandling(getTasks),
    createTask: wrapWithErrorHandling(createTask),
    updateTask: wrapWithErrorHandling(updateTask),
    deleteTask: wrapWithErrorHandling(deleteTask),
};
