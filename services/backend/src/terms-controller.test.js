const { v4: uuid } = require('uuid');
const dayjs = require('dayjs');

const basicUser = { uid: uuid() };

const basicTerm = {
    tid: uuid(),
    uid: basicUser.uid,
    title: 'Basic Term 1',
    startDate: dayjs(),
    endDate: dayjs().add(20, 'days'),
};

const termsController = require('./terms-controller');

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

describe('Schema conversion tests', () => {
    it('toDbFormat ignores invalid props', () => {
        const invalidTerm = { invalidProp: 'watch out!', ...basicTerm };

        const formatted = termsController.__test_only__.toDbFormat(invalidTerm);
        expect(formatted).not.toHaveProperty('invalidProp');
    });

    it('fromDbFormat ignores invalid props', () => {
        const invalidTerm = {
            invalidProp: 'watch out!',
            ...termsController.__test_only__.toDbFormat(basicTerm),
        };

        const formatted = termsController.__test_only__.fromDbFormat(invalidTerm);
        expect(formatted).not.toHaveProperty('invalidProp');
    });
});
