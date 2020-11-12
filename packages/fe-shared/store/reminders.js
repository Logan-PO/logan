import { createEntityAdapter } from '@reduxjs/toolkit';
import { createAsyncSlice, wrapAdapter } from '../utils/redux-utils';
import api from '../utils/api';

function compareStrings(a, b) {
    if (a < b) return -1;
    else if (a > b) return 1;
    else return 0;
}

const adapter = createEntityAdapter({
    selectId: reminder => reminder.rid,
    sortComparer: (a, b) => compareStrings(a.timestamp, b.timestamp),
});

const { slice, asyncActions } = createAsyncSlice({
    name: 'reminders',
    initialState: adapter.getInitialState(),
    reducers: {
        setShouldGoToReminder(state, action) {
            state.shouldGoToReminder = action.payload;
        },
        updateReminderLocal: adapter.updateOne,
    },
    asyncReducers: {
        fetchReminders: {
            fn: api.getReminders,
            success: adapter.setAll,
        },
        createReminder: {
            fn: api.createReminder,
            success: adapter.addOne,
        },
        updateReminder: {
            fn: api.updateReminder,
        },
        deleteReminder: {
            fn: api.deleteReminder,
            begin(state, action) {
                adapter.removeOne(state, action.meta.arg.rid);
            },
        },
    },
});

export const getRemindersSelectors = wrapAdapter(adapter);
export const { setShouldGoToReminder, updateReminderLocal } = slice.actions;
export const { fetchReminders, createReminder, updateReminder, deleteReminder } = asyncActions;
export default slice.reducer;
