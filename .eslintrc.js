module.exports = {
    root: true,
    plugins: ['prettier'],
    extends: ['eslint:recommended', 'prettier'],
    env: {
        es6: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        'prettier/prettier': 'error',
        'no-await-in-loop': 'warn',
        'max-params': ['error', 6],
        camelcase: [
            'warn',
            {
                properties: 'never',
            },
        ],
        'no-underscore-dangle': [
            'error',
            {
                allowAfterThis: true,
                allow: ['__meta__'],
            },
        ],
    },
};
