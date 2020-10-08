import _ from 'lodash';

export default function makeSelectors(adapter, state) {
    return _.mapValues(adapter.getSelectors(), selector => (...params) => selector(state, ...params));
}
