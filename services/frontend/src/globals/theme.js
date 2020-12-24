import { createMuiTheme } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';

const defaultFontFamily = ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Arial', 'sans-serif'];
const headingsFontFamily = ['Poppins', ...defaultFontFamily];

let currentTheme = createMuiTheme();

export function getCurrentTheme() {
    return currentTheme;
}

export function makeTheme(params = {}) {
    const { primary = colors.teal, accent = colors.deepOrange } = params;

    currentTheme = createMuiTheme({
        palette: {
            primary: {
                light: primary[300],
                main: primary[500],
                dark: primary[700],
                contrastText: '#fff',
            },
            secondary: {
                light: accent[300],
                main: accent[500],
                dark: accent[700],
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

    return currentTheme;
}
