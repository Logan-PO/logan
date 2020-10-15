import _ from 'lodash';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { dateUtils } from '@logan/core';
import Promise from 'bluebird';
import { createAsyncSlice, wrapAdapter } from '../utils/redux-utils';
import api from '../utils/api';

function compareStrings(a, b) {
    if (a < b) return -1;
    else if (a > b) return 1;
    else return 0;
}

const termsAdapter = createEntityAdapter({
    selectId: term => term.tid,
    sortComparer: (a, b) => dateUtils.compareDates(a.startDate, b.startDate, dateUtils.constants.DB_DATE_FORMAT),
});

const holidaysAdapter = createEntityAdapter({
    selectId: holiday => holiday.hid,
    sortComparer: (a, b) => dateUtils.compareDates(a.startDate, b.startDate, dateUtils.constants.DB_DATE_FORMAT),
});

const coursesAdapter = createEntityAdapter({
    selectId: course => course.cid,
    sortComparer: (a, b) => compareStrings(a.title, b.title),
});

const sectionsAdapter = createEntityAdapter({
    selectId: section => section.sid,
    sortComparer: (a, b) => compareStrings(a.title, b.title),
});

const adapters = {
    terms: termsAdapter,
    holidays: holidaysAdapter,
    courses: coursesAdapter,
    sections: sectionsAdapter,
};

const { slice, asyncActions } = createAsyncSlice({
    name: 'schedule',
    initialState: _.mapValues(adapters, adapter => adapter.getInitialState()),
    reducers: {},
    asyncReducers: {
        fetchSchedule: {
            async fn() {
                const requests = {
                    terms: api.getTasks,
                    holidays: api.getHolidays,
                    courses: api.getCourses,
                    sections: api.getSections,
                };

                const responses = {};

                await Promise.map(_.entries(requests), async ([prop, fn]) => {
                    responses[prop] = await fn();
                });

                return responses;
            },
            success(state, action) {
                console.log(action);
            },
        },
    },
});

export const selectors = _.mapValues(adapters, wrapAdapter);
export const { fetchSchedule } = asyncActions;
export default slice.reducer;
