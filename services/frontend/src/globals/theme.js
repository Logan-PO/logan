import { createMuiTheme } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';

const primary = colors.teal;
const secondary = colors.deepOrange;

const defaultFontFamily = ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Arial', 'sans-serif'];
const headingsFontFamily = ['Poppins', ...defaultFontFamily];

const theme = createMuiTheme({
    palette: {
        primary: {
            light: primary[300],
            main: primary[500],
            dark: primary[700],
            contrastText: '#fff',
        },
        secondary: {
            light: secondary[300],
            main: secondary[500],
            dark: secondary[700],
            contrastText: '#fff',
        },
        error: {
            main: colors.red[500],
        },
    },
    typography: {
        fontFamily: defaultFontFamily.join(', '),
        h1: { fontFamily: headingsFontFamily.join(',') },
        h2: { fontFamily: headingsFontFamily.join(',') },
        h3: { fontFamily: headingsFontFamily.join(',') },
        h4: { fontFamily: headingsFontFamily.join(',') },
        h5: { fontFamily: headingsFontFamily.join(',') },
        h6: { fontFamily: headingsFontFamily.join(',') },
    },
});

export default theme;
