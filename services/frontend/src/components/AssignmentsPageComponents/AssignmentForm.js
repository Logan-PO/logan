import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {myInput} from "../Field";

class AssignmentForm extends Component {

    render () {
        const {handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <Field
                    name="username"
                    component={myInput}
                    type="text"
                    placeholder="Username"
                />
                <Field
                    name="password"
                    component={myInput}
                    type="text"
                    placeholder="Password"
                />
                <Field
                    name="password"
                    component={myInput}
                    type="text"
                    placeholder="Password"
                />
                <Field
                    name="password"
                    component={myInput}
                    type="text"
                    placeholder="Password"
                />
                <Field
                    name="password"
                    component={myInput}
                    type="text"
                    placeholder="Password"
                />
                <Field
                    name="password"
                    component={myInput}
                    type="text"
                    placeholder="Password"
                />
                <button type="submit" label="submit">Submit</button>
            </form>
        );
    }
}

AssignmentForm = reduxForm ({
    form: 'assignmentForm',
}) (AssignmentForm);

export default AssignmentForm;
