import { dateUtils } from '@logan/core';

export function displayNameForCourse(course) {
    const nicknameValid = course.nickname && course.nickname.trim().length > 0;
    return nicknameValid ? course.nickname : course.title;
}

export function appropriateTextColor(backgroundHex) {
    backgroundHex = backgroundHex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => r + r + g + g + b + b);

    const results = backgroundHex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/);
    if (!results) return '#000000';
    const r = parseInt(results[1], 16);
    const g = parseInt(results[2], 16);
    const b = parseInt(results[3], 16);

    const brightness = (r * 299 + g * 257 + b * 114) / 1000;
    return brightness > 125 ? '#000000' : '#ffffff';
}

export function printSectionTimes(section) {
    const startTime = dateUtils.toTime(section.startTime);
    const endTime = dateUtils.toTime(section.endTime);

    if (startTime.format('a') === endTime.format('a')) {
        return `${startTime.format('h:mm')} - ${endTime.format('h:mma')}`;
    } else {
        return `${startTime.format('h:mma')} - ${endTime.format('h:mma')}`;
    }
}
