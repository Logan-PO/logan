import js from "@eslint/js";
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginJest from "eslint-plugin-jest";
import importPlugin from "eslint-plugin-import";
import globals from 'globals';

export default [
    js.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        files: ['test/**'],
        ...eslintPluginJest.configs['flat/recommended'],
        rules: {
          ...eslintPluginJest.configs['flat/recommended'].rules,
          'jest/prefer-expect-assertions': 'off',
        },
    },
    {
        plugins: {
            import: importPlugin,
            jest: eslintPluginJest,
        },
        ignores: ['**/node_modules/**'],
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.node,
                ...eslintPluginJest.environments.globals.globals,
            }
        },
        rules: {
            'import/no-unresolved': 'error',
            'import/no-extraneous-dependencies': 'error',
            'import/newline-after-import': 'error',
            'import/order': 'error',
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
    },
];
