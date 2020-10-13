const CREATE_TASK = 'CREATE_TASK';

export const createTask = (task) => ({
    type: CREATE_TASK,
    task,
});

export default (state = [], action) => {
    const tasks = [...state];
    switch (action.type) {
        case CREATE_TASK:
            tasks.push(action.task);
            return tasks;
        default:
            return tasks;
    }
};
