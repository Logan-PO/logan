export default {
    preset: 'jest-dynalite',
    moduleNameMapper: {
        '^(packages/.+)': '<rootDir>/$1',
        '^(services/.+)': '<rootDir>/$1',
    }, 
};
