import { DefaultTheme } from 'react-native-paper';
import { teal, deepOrange } from 'material-ui-colors';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: teal[500],
        accent: deepOrange[500],
        background: 'white',
    },
};

export default theme;
