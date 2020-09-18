import {createSlice} from "@reduxjs/toolkit";

export const assignmentSlice = createSlice({
    name: 'assignment',
    initialState: {
        id:0,
        name:'Empty',
        color:'grey',
        class:'CSDS 000',
        desc: 'empty'
    },
    reducers: {

        editAssignment: (state,action) => {
            state.id = action.payload.id
            state.name = action.payload.name
            state.color = action.payload.color
            state.class = action.payload.class
            state.desc = action.payload.desc
        }
    }
})

export const {editAssignment} = assignmentSlice.actions
export default assignmentSlice.reducer
