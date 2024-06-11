import _ from 'lodash';
import { DefaultTheme } from 'react-native-paper';
import { teal, deepOrange } from 'material-ui-colors';
import { textShouldBeLight } from '@logan/fe-shared/utils/colors';

let currentTheme = DefaultTheme;

export function getCurrentTheme() {
    return currentTheme;
}

export function makeTheme(params = {}, overrides = {}) {
    const { primary = teal, accent = deepOrange, ...rest } = params;

    const theme = _.merge(
        {},
        DefaultTheme,
        {
            colors: {
                primary: primary[500],
                accent: accent[500],
                background: 'white',
                contrastText: textShouldBeLight(primary[500]) ? 'white' : 'black',
            },
        },
        rest,
        overrides
    );

    currentTheme = theme;
    return theme;
}
