import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginJest from 'eslint-plugin-jest';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';

export default [
    js.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        plugins: {
            import: importPlugin,
            jest: eslintPluginJest,
        },
        ignores: ['**/node_modules/**'],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.node,
                ...eslintPluginJest.environments.globals.globals,
            },
        },
        settings: {
            'import/internal-regex': '^(packages|services)/.+',
            'import/resolver': {
                alias: {
                    map: [
                        ['packages', './packages'],
                        ['services', './services'],
                    ],
                },
            },
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
    {
        files: ['test/**'],
        ...eslintPluginJest.configs['flat/recommended'],
        rules: {
            ...eslintPluginJest.configs['flat/recommended'].rules,
            'jest/prefer-expect-assertions': 'off',
        },
    },
    // packages/fe-shared
    {
        files: ['packages/fe-shared/**'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
    },
    // services/frontend
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
    // services/mobile-frontend
    {
        ...reactPlugin.configs.flat.recommended,
        files: ['services/mobile-frontend/**'],
        ignores: ['android/**', 'ios/**'],
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
