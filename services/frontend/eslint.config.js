import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';
import rootConfig from '../../eslint.config';

export default [
    rootConfig,
    {
        ...reactPlugin.configs.flat.recommended,
        ignores: ['public/**', '.cache/**'],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];
