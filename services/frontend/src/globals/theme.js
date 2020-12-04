import { createMuiTheme } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';

const primary = colors.teal;
const secondary = colors.deepOrange;

const defaultFontFamily = ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Arial', 'sans-serif'];
const headingsFontFamily = ['Poppins', ...defaultFontFamily];

let isDark = false;

try {
    isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    // eslint-disable-next-line no-empty
} catch (e) {}

const palette = {
    secondary,
    error: colors.red,
};

if (isDark) {
    palette.type = 'dark';
    palette.primary = {
        light: primary[700],
        main: primary[800],
        dark: primary[900],
    };
} else {
    palette.primary = {
        light: primary[300],
        main: primary[500],
        dark: primary[700],
    };
}

const defaultTheme = createMuiTheme({
    palette: {
        type: isDark ? 'dark' : undefined,
    },
});

console.log(defaultTheme);

const theme = createMuiTheme({
    palette,
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
