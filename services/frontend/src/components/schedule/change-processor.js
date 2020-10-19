import _ from 'lodash';

export function getChanges(original, current) {
    const changes = {};

    const missingKeys = _.difference(_.keys(original), _.keys(current));

    for (const missing of missingKeys) {
        changes[missing] = undefined;
    }

    for (const [key, value] of _.entries(current)) {
        if (!_.isEqual(original[key], value)) {
            changes[key] = value;
        }
    }

    return changes;
}
