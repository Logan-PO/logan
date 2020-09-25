import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';

class AssignmentForm extends Component {
    render () {
        const {handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <Field
                    name="username"
                    component="input"
                    type="text"
                    placeholder="Username"
                />
                <Field
                    name="password"
                    component="input"
                    type="password"
                    placeholder="Password"
                />
                <button type="submit" label="submit">Submit</button>
            </form>
        );
    }
}

AssignmentForm = reduxForm ({
    form: 'assignmentform',
}) (AssignmentForm);

export default AssignmentForm;
