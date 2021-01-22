const { v4: uuid } = require('uuid');

const basicUser = { uid: uuid() };

const basicCourse = {
    tid: uuid(),
    cid: uuid(),
    uid: basicUser.uid,
    title: 'Basic Term 1',
    color: '#000000',
};

// eslint-disable-next-line import/newline-after-import
const coursesController = require('./courses-controller');
const { toDbFormat, fromDbFormat } = coursesController.__test_only__;

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

describe('Schema conversion tests', () => {
    it('toDbFormat ignores invalid props', () => {
        const invalid = { invalidProp: 'watch out!', ...basicCourse };

        const formatted = toDbFormat(invalid);
        expect(formatted).not.toHaveProperty('invalidProp');
    });

    it('fromDbFormat ignores invalid props', () => {
        const invalid = {
            invalidProp: 'watch out!',
            ...toDbFormat(basicCourse),
        };

        const formatted = fromDbFormat(invalid);
        expect(formatted).not.toHaveProperty('invalidProp');
    });
});
