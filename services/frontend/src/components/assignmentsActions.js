/**
 * This file is used to define all of the possible actions able to be taken within the assignments page
 */

/**
 * this is used to define an action that the user can take to add an assignment
 * @returns returns the attributes of the assignment that is to be created {{color: string, name: string, id: number, type: string, class: string, desc: string}}
 */
export const addAssignment = () => {
    return{//TODO: the values in this return are temporary and should be filled in via user input through the addAssignmentForm.js
        //The assignment form values will probably be collected via an export from the assignments page
        type: 'addAssignment',
        id: 12,
        name: 'got here',
        color: 'orange',
        class: 'ECON 102',
        desc: 'destroy'
    };
};

//TODO: This will also take in user input and use the id of the assignment to find and remove it from a given assignment day
export const deleteAssignment = () => {
    return{
        type: 'deleteAssignment'
    };
};

//TODO: This will look very similar to add assignment except it will use the existing ID and update the other fields according to user input
export const editAssignment = () => {
    return{
        type: 'editAssignment'
    };
};
