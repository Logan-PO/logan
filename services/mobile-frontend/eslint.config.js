import reactPlugin from "eslint-plugin-react"
import rootConfig from "../../eslint.config";

export default [
    rootConfig,
    reactPlugin.configs.flat.recommended,
    {
        ignorePatterns: ['android/**', 'ios/**'],
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
        rules: {
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
        },
        globals: {
            localStorage: 'writable',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];
