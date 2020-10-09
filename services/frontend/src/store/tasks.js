import _ from 'lodash';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { createAsyncSlice, wrapAdapter } from '../utils/redux-utils';
import api from '../utils/api';

const adapter = createEntityAdapter({
    selectId: task => task.tid,
    sortComparer: (a, b) => a.title < b.title,
});

const { slice, asyncActions } = createAsyncSlice({
    name: 'tasks',
    initialState: adapter.getInitialState(),
    reducers: {
        getTasksForAssignment(state, action) {
            const { aid } = action.payload;
            return _.filter(adapter.getSelectors(state => state.tasks).selectAll(), task => task.aid === aid);
        },
        updateTaskLocal: adapter.updateOne,
        deleteTaskLocal: adapter.removeOne,
    },
    asyncReducers: {
        fetchTasks: {
            fn: api.getTasks,
            success: adapter.setAll,
        },
        createTask: {
            fn: api.createTask,
            success: adapter.addOne,
        },
        updateTask: {
            fn: api.updateTask,
        },
        deleteTask: {
            fn: api.deleteTask,
            begin(state, action) {
                adapter.removeOne(state, { payload: action.meta.arg });
            },
        },
    },
});

export const getTasksSelectors = wrapAdapter(adapter);
export const { getTasksForAssignment, updateTaskLocal, deleteTaskLocal } = slice.actions;
export const { fetchTasks, createTask, updateTask, deleteTask } = asyncActions;
export default slice.reducer;
