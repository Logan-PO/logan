const { v4: uuid } = require('uuid');
const termsController = require('./terms-controller');
const {
    dateUtils: { dayjs },
} = require('packages/core');

const basicUser = { uid: uuid() };

const basicTerm = {
    tid: uuid(),
    uid: basicUser.uid,
    title: 'Basic Term 1',
    startDate: dayjs(),
    endDate: dayjs().add(20, 'days'),
};

const { toDbFormat, fromDbFormat } = termsController.__test_only__;

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

describe('Schema conversion tests', () => {
    it('toDbFormat ignores invalid props', () => {
        const invalidTerm = { invalidProp: 'watch out!', ...basicTerm };

        const formatted = toDbFormat(invalidTerm);
        expect(formatted).not.toHaveProperty('invalidProp');
    });

    it('fromDbFormat ignores invalid props', () => {
        const invalidTerm = {
            invalidProp: 'watch out!',
            ...toDbFormat(basicTerm),
        };

        const formatted = fromDbFormat(invalidTerm);
        expect(formatted).not.toHaveProperty('invalidProp');
    });
});
