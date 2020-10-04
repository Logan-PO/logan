import _ from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tasks: [],
};

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        createTask(state, action) {
            const task = action.payload;
            state.tasks.push(task);
        },
        deleteTask(state, action) {
            _.remove(state.tasks, (task) => task.tid === action.payload.tid);
        },
    },
});

export const { createTask, deleteTask } = slice.actions;
export default slice.reducer;
