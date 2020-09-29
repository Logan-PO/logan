import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {field} from "../Field";

class AssignmentForm extends Component {

    render () {
        const {handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <Field
                    name="class"
                    component={field}
                    type="text"
                    placeholder="class"
                />
                <Field
                    name="name"
                    component={field}
                    type="text"
                    placeholder="name"
                />
                <Field
                    name="desc"
                    component={field}
                    type="text"
                    placeholder="desc"
                />
                <Field
                    name="day"
                    component={field}
                    type="text"
                    placeholder="day"
                />
                <Field
                    name="color"
                    component={field}
                    type="text"
                    placeholder="color"
                />
                <Field
                    name="id"
                    component={field}
                    type="text"
                    placeholder="id"
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
