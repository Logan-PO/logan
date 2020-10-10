import _ from 'lodash';
import { createEntityAdapter } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { createAsyncSlice, wrapAdapter } from '../utils/redux-utils';
import api from '../utils/api';

export function compareTasks(task1, task2) {
    const dueDateComparison = compareDueDates(task1.dueDate, task2.dueDate);
    if (dueDateComparison !== 0) return dueDateComparison;
    if (task1.title !== task2.title) return task1.title < task2.title ? -1 : 1;
    return task1.tid < task2.tid ? -1 : 0;
}

export function compareDueDates(dueDate1, dueDate2) {
    if (dueDate1 === 'asap') {
        if (dueDate2 === 'asap') return 0;
        else return -1;
    } else if (dueDate2 === 'asap') {
        return 1;
    } else if (dueDate1 === 'eventually') {
        if (dueDate2 === 'eventually') return 0;
        else return 1;
    } else if (dueDate2 === 'eventually') {
        return -1;
    } else {
        const date1 = dayjs(dueDate1, 'M/D/YYYY');
        const date2 = dayjs(dueDate2, 'M/D/YYYY');
        if (date1.isBefore(date2)) return -1;
        else if (date1.isAfter(date2)) return 1;
        else return 0;
    }
}

const adapter = createEntityAdapter({
    selectId: task => task.tid,
    sortComparer: compareTasks,
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
