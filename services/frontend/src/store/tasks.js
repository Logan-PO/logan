import _ from 'lodash';
import createAsyncSlice from '../utils/slice-maker';
import api from '../utils/api';

const initialState = {
    tasks: [],
};

const { slice, asyncActions } = createAsyncSlice({
    name: 'tasks',
    initialState,
    reducers: {
        getTasksForAssignment(state, action) {
            const { aid } = action.payload;
            return _.filter(state.tasks, task => task.aid === aid);
        },
        deleteTaskLocal(state, action) {
            _.remove(state.tasks, task => task.tid === action.payload.tid);
        },
    },
    asyncReducers: {
        fetchTasks: {
            fn: api.getTasks,
            success(state, action) {
                state.tasks = action.payload;
            },
        },
        createTask: {
            fn: api.createTask,
            success(state, action) {
                state.tasks.push(action.payload);
            },
        },
        updateTask: {
            fn: api.updateTask,
        },
        deleteTask: {
            fn: api.deleteTask,
            begin(state, action) {
                const { tid } = action.meta.arg;
                _.remove(state.tasks, task => task.tid === tid);
            },
        },
    },
});

export const { getTasksForAssignment, deleteTaskLocal } = slice.actions;
export const { fetchTasks, createTask, updateTask, deleteTask } = asyncActions;
export default slice.reducer;
