import _ from 'lodash';
import axios from 'axios';

const BASE_URL = 'http://logan-backend-dev.us-west-2.elasticbeanstalk.com';
const client = axios.create({
    baseURL: BASE_URL,
});

let bearer;

function setBearerToken(token) {
    if (token) bearer = `Bearer ${token}`;
    else bearer = undefined;

    _.set(client, 'defaults.headers.common.Authorization', bearer);
}

async function getTasks() {
    const response = await client.get('/tasks');
    return response.data;
}

export default {
    setBearerToken,
    getTasks,
};
