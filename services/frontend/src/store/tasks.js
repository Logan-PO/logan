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
        createTask(state, action) {
            const task = action.payload;
            state.tasks.push(task);
        },
        deleteTask(state, action) {
            _.remove(state.tasks, (task) => task.tid === action.payload.tid);
        },
    },
    asyncReducers: {
        fetchTasks: {
            fn: api.getTasks,
            handler(state, action) {
                state.tasks = action.payload;
            },
        },
    },
});

export const { createTask, deleteTask } = slice.actions;
export const { fetchTasks } = asyncActions;
export default slice.reducer;
