# Frontend quick guide

 Gatsby is a sort of _*"middleware"*_ in the sense that it runs itself in response to nodejs starting and compiles all 
 of the js before it is ready to be viewed
 
## Gatsby Commands
 The main commands used will be `gatsby start` for compiling the frontend (this will also be called by gatsby in response
  to `npm start` or `npm run`, `gatsby test`,and possibly `gatsby clean`

The rest of the commands are commands included in the default gatsby package calls when compiling

## Frontend Commands
 If you want to compile and test the frontend simply call the `npm start` command in **services/frontend** and after
 ~10 seconds you will be provided with the link required the website can be found at in the chat. After the first build 
 and compile it is **not** necessary to call `npm start` after every change and all you need to do is refresh the page.

## Using the store
When it comes to using the store there are a few steps you must follow to be able to add items to the store and be able 
to access it

#### Step 1
Define reducers via the `creteSlice()` function from *redux-toolkit*, this will create a *slice* of the store for your 
part of the program and the values you need
 
`createSlice` takes in a **name** for this slice of the store, an **initialState** for this slice of the store to be 
instantiated to when first being called, and **reducers** which perform some oparation and then update the given slice
of the store accordingly by returning the updated slice.

#### Step 2
Next you need to define the actions that can be taken by your slice of the store. Actions are simply objects that are 
passed into reducer functions to be evaluated according to their **type**

An example of an action is `{type: 'increment', args : userInput}`. This action would be passed into the reducer and 
the reducer would look for a case with the name "increment" where it would then pass this entire object/action and handle
 it to the reducer function.
 
Actions require no input and can simply have a type attribute which performs a specific opperation when called by the reducer

#### Step 3
After you have reducer and actions defined you can add them to the store by passing your reducer function into 
`combineReducers` function within the store file.

#### Step 4
Now that your desired objects and their reducers are linked to the state you need to access them from the state, to do this you need to wrap the component that you would like to have access to the store and its objects in a `Provider`.
This would look something like 

```
function wrapper() {
    <Provider store = {store}> 
        <DisplayAssignments/> 
    </Provider> 
}
```
Now when `wrapper()` is called it will call DisplayAssignments for me which is the component that I was to have access to the store

#### Step 5
Now that your desired class has access to the store you need to be able to pull information from it and send information to it.
To receive information from the store you need to use the `useSlector()` function or by using the `connect()` method in react-redux if you are within a react component

##### 5a
To pull info from the store you will need something along the lines of `const assignmentDay = useSelector(state => state.assignmentDay)` this will take the assignmentDay from the state and assign it to this variable so that you can use its information

If you are **not** using a react component you will need to use the `useDispatch()` function to update  the store, an example of this is
 `dispatch =  useDispatch();
 dispatch(addAssignment)` where you pass in an action/object to dispatch, in this case it would simply call dispatch on the object `{type: addAssignment}` since I only provided a name and no other information
 if I wanted to include information I could input the data in this form `dispatch({type:addassignment, args: input})` 
 
##### 5b
 To add and pull within a react component you will have to use the `connect()` function from react-redux
 
 Here is an example of the necessary code block for using connect:
  ```
  //Defining the props that the state will be mapped to for the render method
  const mapStateToProps = (state) => ({
      assignmentCatalog: state.AssignmentsPage,
      formValues: state.form,
      isFormShown: state.isFormShown,
  });

  //Defining the functions and what actions they will dispatch
  const mapDispatchToProps = (dispatch) => {
      return {
          addAssignment: (assignment) => {
              dispatch({
                  type: 'addAssignment',
                  id: assignment.id,
                  name: assignment.name,
                  class: assignment.class,
                  desc: assignment.desc,
                  day: assignment.day,
                  color: assignment.color,
              })
          },
          showForm: () => {
              dispatch( {
                  type: 'showForm'
              })
          },
          hideForm: () => {
              dispatch( {
                  type: 'hideForm',
              })
          },
      }
  };
  export default connect(mapStateToProps, mapDispatchToProps)(AssignmentsPage);
```
