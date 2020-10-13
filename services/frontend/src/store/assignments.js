import _ from 'lodash';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { createAsyncSlice, wrapAdapter } from '../utils/redux-utils';
import api from '../utils/api';

const adapter = createEntityAdapter({
    selectId: assignment => assignment.aid,
    sortComparer: (a, b) => a.name < b.name,
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
                const { aid } = action.meta.arg;
                _.remove(state.assignments, assignment => assignment.aid === aid);
            },
        },
    },
});

export const getAssignmentsSelectors = wrapAdapter(adapter);
export const { updateAssignmentLocal, deleteAssignmentLocal } = slice.actions;
export const { fetchAssignments, createAssignment, updateAssignment, deleteAssignment } = asyncActions;
export default slice.reducer;
