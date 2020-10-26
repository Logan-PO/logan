import { createEntityAdapter } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { createAsyncSlice, wrapAdapter } from '../utils/redux-utils';
import api from '../utils/api';

export function compareAssignments(assignment1, assignment2) {
    const dueDateComparison = compareDueDates(assignment1.dueDate, assignment2.dueDate);
    if (dueDateComparison !== 0) return dueDateComparison;
    if (assignment1.name !== assignment2.name) return assignment1.name < assignment2.name ? -1 : 1;
    return assignment1.aid < assignment2.aid ? -1 : 0;
}

export function compareDueDates(dueDate1, dueDate2) {
    const date1 = dayjs(dueDate1, 'M/D/YYYY');
    const date2 = dayjs(dueDate2, 'M/D/YYYY');
    if (date1.isBefore(date2)) return -1;
    else if (date1.isAfter(date2)) return 1;
    else return 0;
}

const adapter = createEntityAdapter({
    selectId: assignment => assignment.aid,
    sortComparer: compareAssignments,
});

const { slice, asyncActions } = createAsyncSlice({
    name: 'assignments',
    initialState: adapter.getInitialState(),
    reducers: {
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
export const { updateAssignmentLocal, deleteAssignmentLocal } = slice.actions;
export const { fetchAssignments, createAssignment, updateAssignment, deleteAssignment } = asyncActions;
export default slice.reducer;
