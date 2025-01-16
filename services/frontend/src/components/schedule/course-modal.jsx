import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '../shared/dialog';
import TextInput from '../shared/controls/text-input';
import InputGroup from '../shared/controls/input-group';
import ColorPicker, { allValidColors } from '../shared/controls/color-picker';
import ActionButton from '../shared/controls/action-button';
import editorStyles from './page-editor.module.scss';
import { createCourse } from 'packages/fe-shared/store/schedule';

class CourseModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createCourse = this.createCourse.bind(this);

        this._titleRef = React.createRef();

        this.state = {
            fakeId: Math.random().toString(),
            isCreating: false,
            showLoader: false,
            justOpened: false,
            course: {
                tid: props.tid,
                nickname: '',
                color: _.sample(allValidColors)[500],
            },
        };
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.componentWillOpen();
        } else if (this.state.justOpened) {
            this.componentDidOpen();
        }
    }

    componentWillOpen() {
        this.setState({
            fakeId: Math.random().toString(),
            isCreating: false,
            showLoader: false,
            justOpened: true,
            course: {
                tid: this.props.tid,
                nickname: '',
                color: _.sample(allValidColors)[500],
            },
        });
    }

    componentDidOpen() {
        this._titleRef.current && this._titleRef.current.select();
        this.setState({ justOpened: false });
    }

    close() {
        this.props.onClose();
    }

    handleChange(prop, e) {
        const course = this.state.course;

        course[prop] = e.target.value;

        this.setState({ course });
    }

    async createCourse() {
        this.setState({ isCreating: true });
        const timeout = setTimeout(() => this.setState({ showLoader: true }), 500);
        await this.props.createCourse(this.state.course);
        clearTimeout(timeout);
        this.setState({ showLoader: false, isCreating: false });
        this.close();
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                disableBackdropClick={this.state.isCreating}
                disableEscapeKeyDown
                title="New course"
                cancelTitle="Cancel"
                content={
                    <React.Fragment>
                        <InputGroup
                            label="Title"
                            content={
                                <TextInput
                                    style={{ marginBottom: 16 }}
                                    variant="big-input"
                                    placeholder="New course"
                                    fullWidth
                                    value={_.get(this.state.course, 'title', '')}
                                    onChange={this.handleChange.bind(this, 'title')}
                                    inputRef={this._titleRef}
                                />
                            }
                        />
                        <div className={editorStyles.twoCol}>
                            <div className={editorStyles.column}>
                                <InputGroup
                                    label="Nickname"
                                    content={
                                        <TextInput
                                            placeholder="None"
                                            fullWidth
                                            value={_.get(this.state.course, 'nickname', '')}
                                            onChange={this.handleChange.bind(this, 'nickname')}
                                        />
                                    }
                                />
                            </div>
                            <div className={editorStyles.column}>
                                <ColorPicker
                                    label="Color"
                                    fullWidth
                                    value={_.get(this.state.course, 'color', '')}
                                    onChange={this.handleChange.bind(this, 'color')}
                                />
                            </div>
                        </div>
                    </React.Fragment>
                }
                actions={
                    !this.state.showLoader ? (
                        <ActionButton onClick={this.createCourse} disabled={this.state.showLoader}>
                            Create
                        </ActionButton>
                    ) : (
                        <CircularProgress size={24} />
                    )
                }
            />
        );
    }
}

CourseModal.propTypes = {
    tid: PropTypes.string.isRequired,
    open: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    createCourse: PropTypes.func,
};

const mapDispatchToProps = {
    createCourse,
};

export default connect(undefined, mapDispatchToProps)(CourseModal);
