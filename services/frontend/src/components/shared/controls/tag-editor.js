import React from 'react';
import PropTypes from 'prop-types';
import { Chip, FormControl, FormLabel } from '@material-ui/core';
import classes from './tag-editor.module.scss';

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
        this.setState({
            focused: true,
        });

        setTimeout(() => this.labelRef.current.focus(), 10);
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
        let currentLabel = (
            <React.Fragment>
                {!this.state.focused && '\u0020+\u0020'}
                <input
                    ref={this.labelRef}
                    type="text"
                    placeholder="New tag…"
                    className={classes.tagInput}
                    value={this.state.newLabelText}
                    onChange={this.updateLabel}
                    onKeyUp={this.handleKeyUp.bind(this)}
                    style={{
                        display: this.state.focused ? 'inline' : 'none',
                        width: this.estimateWidth(),
                        minWidth: this.estimateWidth('New tag…'),
                    }}
                />
            </React.Fragment>
        );

        return (
            <FormControl fullWidth>
                <FormLabel style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>Tags</FormLabel>
                <div className={classes.tagEditor}>
                    {this.props.tags.map((tag, index) => (
                        <Chip
                            disabled={this.props.disabled}
                            color="primary"
                            size="small"
                            key={index}
                            label={tag}
                            onDelete={this.labelDeleted.bind(this, index)}
                            style={{ margin: '0 4px 6px 0' }}
                        />
                    ))}
                    <Chip
                        disabled={this.props.disabled}
                        color={this.props.disabled ? 'default' : 'primary'}
                        size="small"
                        key="new"
                        variant={this.state.focused ? 'outlined' : 'default'}
                        label={currentLabel}
                        onClick={this.openLabel}
                        {...(this.state.focused ? { onDelete: this.cancelLabel } : {})}
                        onMouseOver={this.hoverNew}
                        style={{
                            opacity: this.state.hovered || this.state.focused ? 1 : 0.75,
                        }}
                        onMouseOut={this.unhoverNew}
                    />
                </div>
            </FormControl>
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
