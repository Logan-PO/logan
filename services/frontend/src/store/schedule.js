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
    reducers: {
        updateTermLocal: termsAdapter.updateOne,
        updateHolidayLocal: holidaysAdapter.updateOne,
        updateCourseLocal: coursesAdapter.updateOne,
        updateSectionLocal: sectionsAdapter.updateOne,
    },
    asyncReducers: {
        fetchSchedule: {
            async fn() {
                const requests = {
                    terms: api.getTerms,
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
                const responses = action.payload;
                for (const [entityType, response] of _.entries(responses)) {
                    adapters[entityType].setAll(state[entityType], response);
                }
            },
        },
        createTerm: {
            fn: api.createTerm,
            success: termsAdapter.addOne,
        },
        createHoliday: {
            fn: api.createHoliday,
            success: holidaysAdapter.addOne,
        },
        createCourse: {
            fn: api.createCourse,
            success: coursesAdapter.addOne,
        },
        createSection: {
            fn: api.createSection,
            success: sectionsAdapter.addOne,
        },
        updateTerm: {
            fn: api.updateTerm,
        },
        updateHoliday: {
            fn: api.updateHoliday,
        },
        updateCourse: {
            fn: api.updateCourse,
        },
        updateSection: {
            fn: api.updateSection,
        },
        deleteTerm: {
            fn: api.deleteTerm,
            begin(state, action) {
                termsAdapter.removeOne(state, action.meta.arg);
            },
        },
        deleteHoliday: {
            fn: api.deleteHoliday,
            begin(state, action) {
                holidaysAdapter.removeOne(state, action.meta.arg);
            },
        },
        deleteCourse: {
            fn: api.deleteCourse,
            begin(state, action) {
                coursesAdapter.removeOne(state, action.meta.arg);
            },
        },
        deleteSection: {
            fn: api.deleteSection,
            begin(state, action) {
                sectionsAdapter.removeOne(state, action.meta.arg);
            },
        },
    },
});

export function getScheduleSelectors(state) {
    const baseSelectors = _.mapValues(adapters, (adapter, name) => wrapAdapter(adapter)(state[name]));

    return {
        baseSelectors,
        getHolidaysForTerm({ tid }) {
            return _.filter(baseSelectors.holidays.selectAll(), holiday => holiday.tid === tid);
        },
        getCoursesForTerm({ tid }) {
            return _.filter(baseSelectors.courses.selectAll(), course => course.tid === tid);
        },
        getSectionsForCourse({ cid }) {
            return _.filter(baseSelectors.sections.selectAll(), section => section.cid === cid);
        },
    };
}

export const {
    fetchSchedule,
    createTerm,
    createHoliday,
    createCourse,
    createSection,
    updateTerm,
    updateHoliday,
    updateCourse,
    updateSection,
    deleteTerm,
    deleteHoliday,
    deleteCourse,
    deleteSection,
} = asyncActions;
export default slice.reducer;
