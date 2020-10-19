module.exports = {
    extends: ['../../.eslintrc.js', 'plugin:react/recommended'],
    ignorePatterns: ['public/**', '.cache/**'],
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
};
