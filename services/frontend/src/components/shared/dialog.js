import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import MuiDialog from '@material-ui/core/Dialog';
import Typography from './typography';
import styles from './dialog.module.scss';
import ActionButton from './controls/action-button';

const Dialog = ({ open, onClose, classes = {}, maxWidth = 'sm', title, content, cancelTitle, actions, ...rest }) => (
    <MuiDialog
        open={open}
        onClose={onClose}
        classes={{ paper: clsx(styles.dialog, classes.dialog) }}
        fullWidth
        maxWidth={maxWidth}
        {...rest}
    >
        <Typography className={clsx(styles.title, classes.title)} variant="navbar-1" useHeaderFont>
            {title}
        </Typography>
        <div className={clsx(styles.content, classes.content)}>{content}</div>
        <div className={clsx(styles.actions, classes.actions)}>
            {cancelTitle && (
                <ActionButton className={styles.cancelButton} textColor="white" onClick={onClose}>
                    {cancelTitle}
                </ActionButton>
            )}
            <div className={styles.flexibleSpace} />
            {actions}
        </div>
    </MuiDialog>
);

Dialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
    classes: PropTypes.exact({
        dialog: PropTypes.string,
        title: PropTypes.string,
        content: PropTypes.string,
        actions: PropTypes.string,
    }),
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
    content: PropTypes.node.isRequired,
    actions: PropTypes.node.isRequired,
    cancelTitle: PropTypes.string,
};

export default Dialog;
