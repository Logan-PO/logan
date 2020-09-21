import React from 'react';
import { Field } from 'redux-form';
import Text from './text';

export const FormComponent = ({ handleSubmit, onSubmit }) => {
    return (
        <div className="flex flex-column justify-center items-center">
            <h1>My Very own Form</h1>
            <form
                className="w-80"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Field
                    name="class"
                    label="class"
                    component={Text}
                />
                <Field
                    name="name"
                    label="name"
                    component={Text}
                />
                <Field
                    name="desc"
                    label="desc"
                    component={Text}
                />
                <Field
                    name="due"
                    label="due"
                    component={Text}
                />
                <Field
                    name="color"
                    label="color"
                    component={Text}
                />
                <button
                    type="submit"
                    className="link br2 bg-blue white dim pa3 f6 sans-serif b--blue ba"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default FormComponent;
