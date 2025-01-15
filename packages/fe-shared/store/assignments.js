import { createEntityAdapter } from '@reduxjs/toolkit';
import { createAsyncSlice, wrapAdapter } from '../utils/redux-utils';
import api from '../utils/api';
import { dateUtils } from 'packages/core';

export function compareAssignments(assignment1, assignment2) {
    const dueDateComparison = compareDueDates(assignment1.dueDate, assignment2.dueDate);
    if (dueDateComparison !== 0) return dueDateComparison;
    if (assignment1.name !== assignment2.name) return assignment1.name < assignment2.name ? -1 : 1;
    return assignment1.aid < assignment2.aid ? -1 : 0;
}

export function compareDueDates(dueDate1, dueDate2) {
    return dateUtils.compareDates(dueDate1, dueDate2, dateUtils.constants.DB_DATE_FORMAT);
}

const adapter = createEntityAdapter({
    selectId: assignment => assignment.aid,
    sortComparer: compareAssignments,
});

const { slice, asyncActions } = createAsyncSlice({
    name: 'assignments',
    initialState: adapter.getInitialState(),
    reducers: {
        setShouldGoToAssignment(state, action) {
            state.shouldGoToAssignment = action.payload;
        },
        updateAssignmentLocal: adapter.updateOne,
        deleteAssignmentLocal: adapter.removeOne,
    },
    asyncReducers: {
        fetchAssignments: {
            fn: api.getAssignments,
            success: adapter.setAll,
        },
        createAssignment: {
            fn: api.createAssignment,
            success: adapter.addOne,
        },
        updateAssignment: {
            fn: api.updateAssignment,
        },
        deleteAssignment: {
            fn: api.deleteAssignment,
            begin(state, action) {
                adapter.removeOne(state, action.meta.arg.aid);
            },
        },
    },
});

export const getAssignmentsSelectors = wrapAdapter(adapter);
export const { updateAssignmentLocal, deleteAssignmentLocal, setShouldGoToAssignment } = slice.actions;
export const { fetchAssignments, createAssignment, updateAssignment, deleteAssignment } = asyncActions;
export default slice.reducer;
