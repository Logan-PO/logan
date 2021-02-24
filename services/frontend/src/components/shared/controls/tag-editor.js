import _ from 'lodash';
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import TagIcon from '@material-ui/icons/LocalOffer';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '../typography';
import { getCurrentTheme } from '../../../globals/theme';
import classes from './tag-editor.module.scss';
import InputGroup from './input-group';
import TextButton from './text-button';

class Tag extends React.Component {
    constructor(props) {
        super(props);

        this.updateEditContent = this.updateEditContent.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.actionsRef = React.createRef();
        this.inputRef = React.createRef();

        this.state = {
            editing: this.props.creating,
            minWidth: 0,
        };
    }

    componentDidMount() {
        if (this.props.creating) {
            this.inputRef.current.focus();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.actionsRef.current) this._updateSizeIfNecessary();

        if (!prevState.editing && this.state.editing) {
            this.inputRef.current.focus();
        }
    }

    handleKeyDown(e) {
        if (e.keyCode === 13) {
            this.enterPressed();
        } else if (e.keyCode === 27) {
            this.cancelLabel();
        }
    }

    enterPressed() {
        if (_.isEmpty(this.state.editContent)) return;

        if (this.props.creating) {
            this.props.onCreate(this.state.editContent);
        } else if (this.state.editing) {
            this.props.onEdit(this.state.editContent);
        }

        this.setState({ editing: false });
    }

    cancelLabel() {
        if (this.props.creating) this.props.onCancel();

        this.setState(
            {
                editing: false,
                editContent: '',
            },
            () => this.inputRef.current.blur()
        );
    }

    beginEditing() {
        this.setState(
            {
                editing: true,
                editContent: this.props.text,
            },
            () => this.inputRef.current.focus()
        );
    }

    updateEditContent(e) {
        this.setState({ editContent: e.target.value });
    }

    _updateSizeIfNecessary() {
        const minWidth = this.actionsRef.current.offsetWidth;

        if (this.state.minWidth !== minWidth) {
            this.setState({ minWidth });
        }
    }

    render() {
        const { text, onDelete } = this.props;
        const { editing, editContent } = this.state;

        const theme = getCurrentTheme();

        return (
            <div
                className={clsx(classes.tag, editing && classes.editing)}
                style={{
                    '--background-color': theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                }}
            >
                <Typography className={classes.text} variant="body2">
                    {editing ? (_.isEmpty(editContent) ? 'New tag…' : editContent) : text}
                </Typography>

                <input
                    ref={this.inputRef}
                    type="text"
                    placeholder="New tag…"
                    className={classes.tagInput}
                    value={this.state.editContent || ''}
                    onChange={this.updateEditContent}
                    onKeyDown={this.handleKeyDown}
                    style={theme.typography.body2}
                />

                {!editing && (
                    <div className={classes.actionsContainer} style={{ minWidth: this.state.minWidth }}>
                        <div className={classes.actions} ref={this.actionsRef}>
                            <ButtonBase onClick={this.beginEditing.bind(this)}>
                                <EditIcon style={{ fontSize: '1rem' }} />
                            </ButtonBase>
                            <ButtonBase onClick={onDelete}>
                                <DeleteIcon style={{ fontSize: '1rem' }} />
                            </ButtonBase>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

Tag.propTypes = {
    text: PropTypes.string,
    creating: PropTypes.bool,
    onCreate: PropTypes.func,
    onCancel: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

class TagEditor extends React.Component {
    constructor(props) {
        super(props);

        this.beginNew = this.beginNew.bind(this);
        this.cancelNew = this.cancelNew.bind(this);
        this.createLabel = this.createLabel.bind(this);
        this.labelEdited = this.labelEdited.bind(this);
        this.labelDeleted = this.labelDeleted.bind(this);

        this.state = {
            isCreatingNew: false,
        };
    }

    beginNew() {
        this.setState({ isCreatingNew: true });
    }

    cancelNew() {
        this.setState({ isCreatingNew: false });
    }

    createLabel(newLabel) {
        this.props.onChange([...this.props.tags, newLabel]);
        this.setState({ isCreatingNew: false });
    }

    labelEdited(index, updatedContent) {
        const newTags = [...this.props.tags];
        newTags[index] = updatedContent;
        this.props.onChange(newTags);
    }

    labelDeleted(tagIndex) {
        const tmp = [...this.props.tags];
        tmp.splice(tagIndex, 1);
        this.props.onChange(tmp);
    }

    render() {
        return (
            <InputGroup
                label="Tags"
                icon={TagIcon}
                content={
                    <div className={classes.tagEditor}>
                        {this.props.tags.map((tag, index) => (
                            <Tag
                                disabled={this.props.disabled}
                                key={index}
                                text={tag}
                                onEdit={this.labelEdited.bind(this, index)}
                                onDelete={this.labelDeleted.bind(this, index)}
                            />
                        ))}
                        {!this.state.isCreatingNew ? (
                            <TextButton
                                size="large"
                                classes={{ root: classes.addButton }}
                                IconComponent={AddIcon}
                                onClick={this.beginNew}
                            >
                                Add tag
                            </TextButton>
                        ) : (
                            <Tag key="new" creating onCreate={this.createLabel} onCancel={this.cancelNew} />
                        )}
                    </div>
                }
            />
        );
    }
}

TagEditor.propTypes = {
    disabled: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
};

TagEditor.defaultProps = {
    tags: [],
};

export default TagEditor;
