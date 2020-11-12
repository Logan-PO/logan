import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setShouldGoTo, getScheduleSelectors } from '@logan/fe-shared/store/schedule';
import { Page } from '../shared';
import TermsList from './terms-list';
import TermChildrenList from './term-children-list';
import SectionsList from './sections-list';
import TermEditor from './term-editor';
import CourseEditor from './course-editor';
import HolidayEditor from './holiday-editor';
import SectionEditor from './section-editor';
import styles from './schedule-page.module.scss';

class SchedulePage extends React.Component {
    constructor(props) {
        super(props);

        this.onTermSelected = this.onTermSelected.bind(this);
        this.onCourseSelected = this.onCourseSelected.bind(this);
        this.onHolidaySelected = this.onHolidaySelected.bind(this);
        this.onSectionSelected = this.onSectionSelected.bind(this);

        this.state = {
            selectedTid: undefined,
            selectedCid: undefined,
            selectedHid: undefined,
        };
    }

    componentDidMount() {
        if (!_.isEmpty(this.props.shouldGoTo)) {
            this.handleShouldGoTo();
        }
    }

    componentDidUpdate(prevProps) {
        if (!_.isEmpty(this.props.shouldGoTo) && !_.isEqual(this.props.shouldGoTo, prevProps.shouldGoTo)) {
            this.handleShouldGoTo();
        }
    }

    handleShouldGoTo() {
        if (_.isEmpty(this.props.shouldGoTo)) return;
        const { eid, type } = this.props.shouldGoTo;
        switch (type) {
            case 'term':
                this.onTermSelected(eid);
                break;
            case 'course':
                this.onCourseSelected(eid);
                break;
            case 'holiday':
                this.onHolidaySelected(eid);
                break;
            case 'section':
                this.onSectionSelected(eid);
                break;
            default:
                console.warn(`Unrecognized shouldGoTo type ${type}`);
                break;
        }

        this.props.setShouldGoTo();
    }

    onTermSelected(tid) {
        this.setState({
            selectedTid: tid,
            selectedCid: undefined,
            selectedHid: undefined,
            selectedSid: undefined,
        });
    }

    onCourseSelected(cid) {
        const course = this.props.getCourse(cid);

        this.setState({
            selectedTid: course.tid,
            selectedCid: cid,
            selectedHid: undefined,
            selectedSid: undefined,
        });
    }

    onHolidaySelected(hid) {
        const holiday = this.props.getHoliday(hid);

        this.setState({
            selectedTid: holiday.tid,
            selectedCid: undefined,
            selectedHid: hid,
            selectedSid: undefined,
        });
    }

    onSectionSelected(sid) {
        const section = this.props.getSection(sid);
        const course = this.props.getCourse(section.cid);

        this.setState({
            selectedTid: course.tid,
            selectedCid: section.cid,
            selectedHid: undefined,
            selectedSid: sid,
        });
    }

    editorToDisplay() {
        if (this.state.selectedSid) {
            return <SectionEditor sid={this.state.selectedSid} />;
        } else if (this.state.selectedCid) {
            return <CourseEditor cid={this.state.selectedCid} />;
        } else if (this.state.selectedHid) {
            return <HolidayEditor hid={this.state.selectedHid} />;
        } else {
            return <TermEditor tid={this.state.selectedTid} />;
        }
    }

    render() {
        return (
            <Page title="Schedule">
                <div className={styles.schedulePage}>
                    <div className={styles.list}>
                        <TermsList selectedTid={this.state.selectedTid} onTermSelected={this.onTermSelected} />
                    </div>
                    <div className={styles.list}>
                        <TermChildrenList
                            tid={this.state.selectedTid}
                            selectedId={this.state.selectedCid || this.state.selectedHid}
                            onCourseSelected={this.onCourseSelected}
                            onHolidaySelected={this.onHolidaySelected}
                        />
                    </div>
                    <div className={styles.list}>
                        <SectionsList
                            cid={this.state.selectedCid}
                            selectedSid={this.state.selectedSid}
                            onSectionSelected={this.onSectionSelected}
                        />
                    </div>
                    {this.editorToDisplay()}
                </div>
            </Page>
        );
    }
}

SchedulePage.propTypes = {
    shouldGoTo: PropTypes.object,
    setShouldGoTo: PropTypes.func,
    getTerm: PropTypes.func,
    getCourse: PropTypes.func,
    getHoliday: PropTypes.func,
    getSection: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getScheduleSelectors(state.schedule).baseSelectors;

    return {
        shouldGoTo: state.schedule.shouldGoTo,
        getTerm: selectors.terms.selectById,
        getCourse: selectors.courses.selectById,
        getHoliday: selectors.holidays.selectById,
        getSection: selectors.sections.selectById,
    };
};

const mapDispatchToProps = {
    setShouldGoTo,
};

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);
