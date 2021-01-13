import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../typography';
import styles from './input-group.module.scss';

const InputGroup = ({ color, accessory, icon, emptyAccessory = false, label, content }) => {
    const hasAccessory = emptyAccessory || accessory || icon;
    let accessoryContent = accessory;

    if (icon) {
        const IconComponent = icon;
        accessoryContent = <IconComponent style={{ fontSize: 22, color: color || '#646464' }} />;
    }

    return (
        <table className={styles.inputGroup}>
            <tbody>
                {label && (
                    <tr>
                        {hasAccessory && <td />}
                        <td style={{ width: '100%' }}>
                            <Typography variant="detail-label">{label}</Typography>
                        </td>
                    </tr>
                )}
                <tr>
                    {hasAccessory && (
                        <td>
                            <div className={styles.accessory}>{accessoryContent}</div>
                        </td>
                    )}
                    <td style={{ width: '100%' }}>{content}</td>
                </tr>
            </tbody>
        </table>
    );
};

InputGroup.propTypes = {
    accessory: PropTypes.node,
    emptyAccessory: PropTypes.bool,
    label: PropTypes.string,
    content: PropTypes.node,
    icon: PropTypes.elementType,
    color: PropTypes.string,
};

export default InputGroup;
