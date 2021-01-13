import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../typography';
import styles from './input-group.module.scss';

const InputGroup = ({ accessory, emptyAccessory = false, label, content }) => (
    <table className={styles.inputGroup}>
        <tbody>
            {label && (
                <tr>
                    {(accessory || emptyAccessory) && <td />}
                    <td>
                        <Typography variant="detail-label">{label}</Typography>
                    </td>
                </tr>
            )}
            <tr>
                {(accessory || emptyAccessory) && (
                    <td>
                        <div className={styles.accessory}>{accessory}</div>
                    </td>
                )}
                <td>{content}</td>
            </tr>
        </tbody>
    </table>
);

InputGroup.propTypes = {
    accessory: PropTypes.node,
    emptyAccessory: PropTypes.boolean,
    label: PropTypes.string,
    content: PropTypes.node,
};

export default InputGroup;
