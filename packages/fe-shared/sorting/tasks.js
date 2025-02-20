import _ from 'lodash';
import { compareDueDates } from '../store/tasks';
import { dateUtils } from 'packages/core';

export function initialQuickSort(showComplete, a, b) {
    if (showComplete) {
        return dateUtils.compareDates(
            a.completionDate,
            b.completionDate,
            dateUtils.constants.DB_DATETIME_FORMAT,
            'minute'
        );
    } else {
        return compareDueDates(a.dueDate, b.dueDate);
    }
}

function makeSectionsIncomplete(tasks) {
    const sections = {};
    const now = dateUtils.dayjs();

    function addToSection(task, section) {
        if (!sections[section]) sections[section] = [task];
        else sections[section].push(task);
    }

    for (const task of tasks) {
        if (task.dueDate === 'asap') {
            addToSection(task, 'ASAP');
        } else if (task.dueDate === 'eventually') {
            addToSection(task, 'Eventually');
        } else {
            const dueDate = dateUtils.dayjs(task.dueDate, dateUtils.constants.DB_DATE_FORMAT);

            if (dueDate.isBefore(now, 'day')) {
                addToSection(task, 'Overdue');
            } else {
                addToSection(task, task.dueDate);
            }
        }
    }

    return sections;
}

function makeSectionsComplete(tasks) {
    const groupedEntries = _.entries(
        _.groupBy(tasks, task => dateUtils.formatAsDate(dateUtils.toDate(task.completionDate)))
    );

    const sortedEntries = groupedEntries.sort(([a], [b]) =>
        dateUtils.compareDates(b, a, dateUtils.constants.DB_DATE_FORMAT, 'day')
    );

    const formattedEntries = sortedEntries.map(([date, tasks]) => {
        const completion = dateUtils.humanReadableDate(dateUtils.toDate(date), { forSentence: true });
        return [`Completed ${completion}`, tasks];
    });

    return _.fromPairs(formattedEntries);
}

export function makeSections(showComplete, tasks) {
    return showComplete ? makeSectionsComplete(tasks) : makeSectionsIncomplete(tasks);
}

function compareStrings(a, b) {
    if (a === b) return 0;
    else return a < b ? -1 : 1;
}

export function sortWithinSection(a, b) {
    if (a.priority !== b.priority) return b.priority - a.priority;
    if (a.aid && b.aid && a.aid !== b.aid) return compareStrings(a.aid, b.aid);
    if (a.cid && b.cid && a.cid !== b.cid) return compareStrings(a.cid, b.cid);
    if (a.title !== b.title) return compareStrings(a.title, b.title);
    return compareStrings(a.tid, b.tid);
}

export function getSections(tasks, showCompleted) {
    const sorted = [...tasks];
    sorted.sort(initialQuickSort.bind(this, showCompleted));

    const sections = makeSections(showCompleted, tasks);

    for (const tasks of _.values(sections)) {
        tasks.sort(sortWithinSection);
    }

    return _.entries(_.mapValues(sections, tasks => _.map(tasks, 'tid')));
}
