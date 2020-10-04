import _ from 'lodash';
import axios from 'axios';

const BASE_URL = 'http://logan-backend-dev.us-west-2.elasticbeanstalk.com';
const client = axios.create({
    baseURL: BASE_URL,
});

let bearer;

function setBearerToken(token) {
    bearer = token;

    if (bearer) {
        _.set(client, 'defaults.headers.common.Authorization', `Bearer ${bearer}`);
    } else {
        _.set(client, 'defaults.headers.common.Authorization', undefined);
    }
}

async function getTasks() {
    const response = await client.get('/tasks');
    return response.data;
}

export default {
    setBearerToken,
    getTasks,
};
