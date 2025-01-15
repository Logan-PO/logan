import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import * as muiColors from '@material-ui/core/colors';
import Typography from '../typography';
import styles from './color-picker.module.scss';
import InputGroup from './input-group';

export const allValidColors = _.omit(muiColors, ['common']);
export const primaryColors = _.pick(allValidColors, [
    'teal',
    'green',
    'lightGreen',
    'orange',
    'deepOrange',
    'red',
    'pink',
    'purple',
    'deepPurple',
    'indigo',
    'blue',
    'lightBlue',
    'blueGrey',
]);

function camelCaseToSentenceCase(str) {
    return _.upperFirst(
        _.camelCase(str)
            .replace(/([A-Z])/g, ' $1')
            .toLowerCase()
    );
}

function nameForColor(hexValue) {
    for (const camelCasedName of _.keys(muiColors)) {
        if (
            _.values(muiColors[camelCasedName])
                .map(hex => hex.toLowerCase())
                .includes(hexValue.toLowerCase())
        ) {
            return camelCaseToSentenceCase(camelCasedName);
        }
    }
}

class ColorPicker extends React.Component {
    constructor(props) {
        super(props);

        this.pickerRef = React.createRef();
        this.groupRef = React.createRef();

        this.generateItems = this.generateItems.bind(this);
        this.selectColor = this.selectColor.bind(this);
        this.openPicker = this.openPicker.bind(this);
        this.closePicker = this.closePicker.bind(this);

        this.state = {
            pickerOpen: false,
            backdropSize: {
                width: 100,
                height: 45,
            },
        };
    }

    componentDidMount() {
        this._updateBackdropSizeIfNecessary();
    }

    componentDidUpdate() {
        this._updateBackdropSizeIfNecessary();
    }

    _updateBackdropSizeIfNecessary() {
        if (this.groupRef.current) {
            if (this.state.backdropSize.width !== this.groupRef.current.offsetWidth) {
                this.setState({
                    backdropSize: {
                        width: this.groupRef.current.offsetWidth,
                        height: this.groupRef.current.offsetHeight,
                    },
                });
            }
        }
    }

    selectColor(hex) {
        if (this.props.onChange) {
            this.props.onChange({
                target: {
                    value: hex,
                },
            });
        }
    }

    openPicker() {
        this.setState({ pickerOpen: true });
    }

    closePicker() {
        this.setState({ pickerOpen: false });
    }

    generateItems() {
        const colors = this.props.primaryOnly ? primaryColors : allValidColors;

        const rows = [];

        const chunks = _.chunk(_.entries(colors), 7);

        let key = 0;
        for (const chunk of chunks) {
            rows.push(
                <div key={key++} className={styles.swatchRow}>
                    {chunk.map(([key, value]) => {
                        const name = camelCaseToSentenceCase(key);
                        const color = value[500];

                        const isSelected = this.props.value === color;
                        const className = `${styles.swatch} ${isSelected ? styles.selected : ''}`;

                        return (
                            <div
                                key={color}
                                title={name}
                                className={className}
                                style={{ background: color }}
                                onClick={isSelected ? undefined : this.selectColor.bind(this, color)}
                            />
                        );
                    })}
                </div>
            );
        }

        return rows;
    }

    render() {
        return (
            <div className={styles.root}>
                <div className={styles.inputGroupContainer} onClick={this.openPicker}>
                    <InputGroup
                        ref={this.groupRef}
                        label={this.props.label}
                        color={this.props.value}
                        content={
                            <Typography style={{ userSelect: 'none', color: this.props.value }}>
                                {nameForColor(this.props.value)}
                            </Typography>
                        }
                    />
                </div>
                <Popover
                    open={this.state.pickerOpen}
                    anchorEl={this.groupRef.current}
                    classes={{ paper: styles.pickerPaper }}
                    elevation={0}
                    onClose={this.closePicker}
                >
                    <div className={styles.pickerContainer} style={{ color: this.props.value }}>
                        <div className={styles.backdropContainer} onClick={this.closePicker}>
                            <div
                                className={styles.groupBackdrop}
                                style={{
                                    width: this.state.backdropSize.width + 12,
                                    height: this.state.backdropSize.height + 4,
                                }}
                            >
                                <InputGroup
                                    style={{ position: 'absolute' }}
                                    label={
                                        <span style={{ userSelect: 'none', color: 'white' }}>{this.props.label}</span>
                                    }
                                    color="white"
                                    content={
                                        <Typography style={{ userSelect: 'none', color: 'white' }}>
                                            {nameForColor(this.props.value)}
                                        </Typography>
                                    }
                                />
                            </div>
                            <svg width={4} height={4} style={{ fill: 'currentColor' }}>
                                <path
                                    d="M 0 4
                                   L 0 0
                                   A 4 4 0 0 0 4 4
                                   L 0 4"
                                />
                            </svg>
                        </div>
                        <div
                            className={styles.pickerContent}
                            style={{ top: this.state.backdropSize.height + 4 }}
                            ref={this.pickerRef}
                        >
                            <div className={styles.colorsContainer}>{this.generateItems()}</div>
                        </div>
                    </div>
                </Popover>
            </div>
        );
    }
}

ColorPicker.propTypes = {
    label: PropTypes.string,
    primaryOnly: PropTypes.bool,
    variant: PropTypes.string,
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    disableNone: PropTypes.bool,
};

export default ColorPicker;
