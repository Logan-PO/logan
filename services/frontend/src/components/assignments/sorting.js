import _ from 'lodash';
import { compareDueDates } from '../../store/tasks';

export function initialQuickSort(showPast, a, b) {
    if (showPast) {
        return compareDueDates(b.dueDate, a.dueDate);
    } else {
        return compareDueDates(a.dueDate, b.dueDate);
    }
}

function makeSectionsUpcoming(assignments) {
    const sections = {};

    function addToSection(task, section) {
        if (!sections[section]) sections[section] = [task];
        else sections[section].push(task);
    }

    for (const assignment of assignments) {
        addToSection(assignment, assignment.dueDate);
    }

    return sections;
}

function makeSectionsPast(assignments) {
    return _.groupBy(assignments, 'dueDate');
}

export function makeSections(assignments, showPast) {
    return showPast ? makeSectionsPast(assignments) : makeSectionsUpcoming(assignments);
}

function compareStrings(a, b) {
    if (a === b) return 0;
    else return a < b ? -1 : 1;
}

export function sortWithinSection(a, b) {
    if (a.cid && b.cid && a.cid !== b.cid) return compareStrings(a.cid, b.cid);
    if (a.title !== b.title) return compareStrings(a.title, b.title);
    return compareStrings(a.aid, b.aid);
}

export function getSections(assignments, showPast) {
    const sorted = [...assignments];
    sorted.sort(initialQuickSort.bind(this, showPast));

    const sections = makeSections(sorted, showPast);

    for (const arr of _.values(sections)) {
        arr.sort(sortWithinSection);
    }

    return _.entries(_.mapValues(sections, arr => _.map(arr, 'aid')));
}
