import { colors } from '@material-ui/core';

const priorities = {
    'Very high': [2, colors.deepOrange[500]],
    High: [1, colors.orange[500]],
    Normal: [0, colors.yellow[500]],
    Low: [-1, colors.green[500]],
    'Very low': [-2, colors.blue[500]],
};

export default priorities;
