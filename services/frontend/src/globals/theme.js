import { createTheme } from '@mui/material';
import { colors } from '@mui/material';

export const defaultFontFamily = ['Rubik', '-apple-system', 'BlinkMacSystemFont', 'Arial', 'sans-serif'];
export const headingsFontFamily = ['Poppins', ...defaultFontFamily];

let currentTheme = createTheme();

export function getCurrentTheme() {
    return currentTheme;
}

export function makeTheme(params = {}) {
    const { primary = colors.teal, accent = colors.deepOrange } = params;

    currentTheme = createTheme({
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
                contrastText: '#fff',
            },
        },
        typography: {
            fontFamily: defaultFontFamily.join(', '),
            h1: { fontFamily: headingsFontFamily.join(','), fontWeight: 500, fontSize: '2.25rem' },
            h2: { fontFamily: headingsFontFamily.join(','), fontWeight: 500, fontSize: '1.5rem' },
            h3: { fontFamily: headingsFontFamily.join(',') },
            h4: { fontFamily: headingsFontFamily.join(',') },
            h5: { fontFamily: headingsFontFamily.join(',') },
            h6: { fontFamily: headingsFontFamily.join(',') },
            body1: { fontSize: '0.9rem' },
            body2: { fontSize: '0.75rem' },
            button: { fontWeight: 'normal', textTransform: 'none' },
        },
    });

    return currentTheme;
}
