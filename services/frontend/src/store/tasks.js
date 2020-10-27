import { createEntityAdapter } from '@reduxjs/toolkit';
import { dateUtils } from '@logan/core';
import { createAsyncSlice, wrapAdapter } from '../utils/redux-utils';
import api from '../utils/api';

const { dayjs } = dateUtils;

function compareStrings(a, b) {
    if (a === b) return 0;
    else return a < b ? -1 : 1;
}

export function compareTasks(task1, task2) {
    const dueDateComparison = compareDueDates(task1.dueDate, task2.dueDate);
    if (dueDateComparison !== 0) return dueDateComparison;
    if (task1.priority !== task2.priority) return task2.priority - task1.priority;
    if (task1.cid && task2.cid && task1.cid !== task2.cid) return compareStrings(task1.cid, task2.cid);
    if (task1.title !== task2.title) return compareStrings(task1.title, task2.title);
    return compareStrings(task1.tid, task2.tid);
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
        const date1 = dayjs(dueDate1);
        const date2 = dayjs(dueDate2);

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
                adapter.removeOne(state, action.meta.arg.tid);
            },
        },
    },
});

export const getTasksSelectors = wrapAdapter(adapter);
export const { updateTaskLocal, deleteTaskLocal } = slice.actions;
export const { fetchTasks, createTask, updateTask, deleteTask } = asyncActions;
export default slice.reducer;
