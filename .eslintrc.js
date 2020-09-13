module.exports = {
    root: true,
    plugins: ['prettier'],
    extends: ['eslint:recommended', 'prettier', 'plugin:jest/recommended'],
    env: {
        es6: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        'prefer-template': 'error',
        'prettier/prettier': 'error',
        'no-await-in-loop': 'warn',
        'max-params': ['error', 6],
        camelcase: [
            'warn',
            {
                properties: 'never',
                allow: ['__test_only__'],
            },
        ],
        'no-underscore-dangle': [
            'error',
            {
                allowAfterThis: true,
                allow: ['__test_only__', '__meta__'],
            },
        ],
    },
};
