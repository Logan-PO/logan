import rootConfig from '../../eslint.config';

export default [
    rootConfig,
    {
        globals: {
            document: 'readable',
            localStorage: 'writable',
        },
    },
];
