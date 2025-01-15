import { blue, green, yellow, orange, deepOrange } from 'material-ui-colors';

const priorities = {
    'Very high': [2, deepOrange[500]],
    High: [1, orange[500]],
    Normal: [0, yellow[500]],
    Low: [-1, green[500]],
    'Very low': [-2, blue[500]],
};

export default priorities;
