import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dateUtils } from '@logan/core';
import { List, ListSubheader } from '@material-ui/core';
import { getTasksSelectors, fetchTasks, compareDueDates } from '../../store/tasks';
import styles from '../tasks/tasks-list.module.scss';
import OverviewTaskCell from './overview-task-cell';

class OverviewTasks extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTid: undefined,
        };
    }

    render() {
        return (
            <div className={styles.tasksList}>
                <div className={styles.scrollview}>
                    <List>
                        {this.props.sections.map(section => {
                            const [dueDate, tids] = section;
                            return (
                                <React.Fragment key={section[0]}>
                                    <ListSubheader className={styles.heading}>{dueDate}</ListSubheader>
                                    {tids.map(tid => (
                                        <OverviewTaskCell key={tid} tid={tid} />
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </List>
                </div>
            </div>
        );
    }
}

OverviewTasks.propTypes = {
    sections: PropTypes.arrayOf(PropTypes.array),
    fetchTasks: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getTasksSelectors(state.tasks);
    const sections = {};
    for (const task of selectors.selectAll()) {
        const key = dateUtils.dueDateIsDate(task.dueDate) ? dateUtils.dayjs(task.dueDate) : task.dueDate;
        if (sections[key]) sections[key].push(task.tid);
        else sections[key] = [task.tid];
    }

    return {
        sections: _.entries(sections)
            .sort((a, b) => compareDueDates(a[0], b[0]))
            .map(([key, value]) => [dateUtils.readableDueDate(key), value]),
    };
};

const mapDispatchToProps = { fetchTasks };

export default connect(mapStateToProps, mapDispatchToProps)(OverviewTasks);
