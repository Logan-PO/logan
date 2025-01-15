import React from 'react';
import PropTypes from 'prop-types';
import { dateUtils } from 'packages/core';
import { Grid, Typography, ButtonGroup, Button } from '@material-ui/core';
import LeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import RightIcon from '@material-ui/icons/KeyboardArrowRight';
import TodayIcon from '@material-ui/icons/Adjust';
import classes from './toolbar.module.scss';

class Toolbar extends React.Component {
    constructor(props) {
        super(props);

        this.goToToday = this.goToToday.bind(this);
        this.previous = this.previous.bind(this);
        this.next = this.next.bind(this);
    }

    goToToday() {
        this.props.onNavigate('TODAY');
    }

    previous() {
        this.props.onNavigate('PREV');
    }

    next() {
        this.props.onNavigate('NEXT');
    }

    updateViewType(viewType) {
        this.props.onView(viewType);
    }

    currentTitle() {
        const now = dateUtils.dayjs();
        const currentDate = dateUtils.dayjs(this.props.date);

        if (this.props.view === 'month') {
            return currentDate.format('MMMM YYYY');
        } else {
            const weekStart = currentDate.weekday(0);
            const weekEnd = currentDate.weekday(6);
            const weeksDiff = currentDate.week() - now.week() + (currentDate.year() - now.year()) * 52;

            if (weeksDiff === 0) return 'This Week';
            else if (weeksDiff === 1) return 'Next Week';
            else if (weeksDiff === -1) return 'Last Week';
            else if (weekStart.isSame(weekEnd, 'month')) {
                return `${weekStart.format('MMMM Do')} - ${weekEnd.format('Do')}`;
            } else {
                return `${weekStart.format('MMMM Do')} - ${weekEnd.format('MMMM Do')}`;
            }
        }
    }

    render() {
        return (
            <Grid container className={classes.toolbar} alignItems="center">
                <Grid item xs={2}>
                    <ButtonGroup size="small" variant="contained" disableElevation color="primary">
                        <Button
                            onClick={this.updateViewType.bind(this, 'month')}
                            style={{ opacity: this.props.view === 'month' ? 0.5 : 1 }}
                        >
                            Month
                        </Button>
                        <Button
                            onClick={this.updateViewType.bind(this, 'week')}
                            style={{ opacity: this.props.view === 'week' ? 0.5 : 1 }}
                        >
                            Week
                        </Button>
                    </ButtonGroup>
                </Grid>
                <Grid item style={{ flexGrow: 1 }} />
                <Grid item>
                    <Typography variant="h6">{this.currentTitle()}</Typography>
                </Grid>
                <Grid item style={{ flexGrow: 1 }} />
                <Grid item xs={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ButtonGroup size="small" variant="contained" color="primary" disableElevation>
                        <Button onClick={this.previous}>
                            <LeftIcon fontSize="small" />
                        </Button>
                        <Button onClick={this.goToToday}>
                            <TodayIcon fontSize="small" />
                        </Button>
                        <Button onClick={this.next}>
                            <RightIcon fontSize="small" />
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }
}

Toolbar.propTypes = {
    date: PropTypes.object,
    view: PropTypes.string,
    onView: PropTypes.func,
    onNavigate: PropTypes.func,
};

export default Toolbar;
