import React from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@material-ui/core';
import TagIcon from '@material-ui/icons/LocalOffer';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import Typography from '../typography';
import { getCurrentTheme } from '../../../globals/theme';
import classes from './tag-editor.module.scss';
import InputGroup from './input-group';
import TextButton from './text-button';

// eslint-disable-next-line react/prop-types
const CustomChip = ({ style, ...rest }) => (
    <Chip
        className={classes.chip}
        variant="outlined"
        size="small"
        style={{ margin: '0 4px 6px 0', ...style }}
        {...rest}
    />
);

class TagEditor extends React.Component {
    constructor(props) {
        super(props);

        this.openLabel = this.openLabel.bind(this);
        this.cancelLabel = this.cancelLabel.bind(this);
        this.createLabel = this.createLabel.bind(this);
        this.updateLabel = this.updateLabel.bind(this);
        this.hoverNew = this.hoverNew.bind(this);
        this.unhoverNew = this.unhoverNew.bind(this);

        this.labelRef = React.createRef();

        this.state = {
            focused: false,
            newLabelText: '',
            hovered: false,
        };
    }

    labelDeleted(tagIndex) {
        const tmp = [...this.props.tags];
        tmp.splice(tagIndex, 1);
        this.props.onChange(tmp);
    }

    openLabel() {
        this.setState(
            {
                focused: true,
            },
            () => this.labelRef.current.focus()
        );
    }

    cancelLabel() {
        this.setState({
            focused: false,
            newLabelText: '',
        });
    }

    createLabel() {
        this.props.onChange([...this.props.tags, this.state.newLabelText]);

        this.setState({
            focused: false,
            newLabelText: '',
        });
    }

    updateLabel(e) {
        this.setState({ newLabelText: e.target.value });
    }

    estimateWidth(sampleText) {
        if (!this.labelRef.current) return 0;
        // eslint-disable-next-line no-undef
        const canvas = this.estimateWidth.canvas || (this.estimateWidth.canvas = document.createElement('canvas'));
        const context = canvas.getContext('2d');
        // eslint-disable-next-line no-undef
        context.font = window.getComputedStyle(this.labelRef.current).font;
        const metrics = context.measureText(sampleText || this.state.newLabelText);
        return metrics.width + 4;
    }

    handleKeyUp(e) {
        if (e.keyCode === 13) {
            this.createLabel();
        } else if (e.keyCode === 27) {
            this.cancelLabel();
        }
    }

    hoverNew() {
        this.setState({ hovered: true });
    }

    unhoverNew() {
        this.setState({ hovered: false });
    }

    render() {
        const theme = getCurrentTheme();

        let currentLabel = (
            <React.Fragment>
                <input
                    ref={this.labelRef}
                    type="text"
                    placeholder="New tag…"
                    className={classes.tagInput}
                    value={this.state.newLabelText}
                    onChange={this.updateLabel}
                    onKeyUp={this.handleKeyUp.bind(this)}
                    style={{
                        display: 'inline',
                        width: this.estimateWidth(),
                        minWidth: this.estimateWidth('New tag…'),
                        ...theme.typography.body2,
                    }}
                />
            </React.Fragment>
        );

        return (
            <InputGroup
                label="Tags"
                icon={TagIcon}
                content={
                    <div className={classes.tagEditor}>
                        {this.props.tags.map((tag, index) => (
                            <CustomChip
                                disabled={this.props.disabled}
                                key={index}
                                label={<Typography variant="body2">{tag}</Typography>}
                                onDelete={this.labelDeleted.bind(this, index)}
                            />
                        ))}
                        {!this.state.focused ? (
                            <TextButton className={classes.addButton} IconComponent={AddIcon} onClick={this.openLabel}>
                                Add tag
                            </TextButton>
                        ) : (
                            <CustomChip
                                key="new"
                                label={currentLabel}
                                onDelete={this.cancelLabel}
                                onMouseOver={this.hoverNew}
                                onMouseOut={this.unhoverNew}
                            />
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
