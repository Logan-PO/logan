/**
 * A base implementation for the reducer used to edit assignments
 * When called it uses the given initial state and the fields will prompty be updated via the actions fields
 */
const assignmentReducer = (state = {
    id:0,
    name:'Empty',
    color:'grey',
    class:'CSDS 000',
    desc: 'empty'} ,action) => {

    switch (action.type){
        case 'editAssignment':
           return {
               id: action.payload.id,
               name: action.payload.name,
               color: action.payload.color,
               class: action.payload.class,
               desc: action.payload.desc
           }
        default:
            return state


    }

}

export default assignmentReducer
