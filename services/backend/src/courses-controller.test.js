const { v4: uuid } = require('uuid');

const basicUser = { uid: uuid() };

const basicCourse = {
    tid: uuid(),
    cid: uuid(),
    uid: basicUser.uid,
    title: 'Basic Term 1',
    color: '#000000',
};

const coursesController = require('./courses-controller');

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

describe('Schema conversion tests', () => {
    it('toDbFormat ignores invalid props', () => {
        const invalid = { invalidProp: 'watch out!', ...basicCourse };

        const formatted = coursesController.__test_only__.toDbFormat(invalid);
        expect(formatted).not.toHaveProperty('invalidProp');
    });

    it('fromDbFormat ignores invalid props', () => {
        const invalid = {
            invalidProp: 'watch out!',
            ...coursesController.__test_only__.toDbFormat(basicCourse),
        };

        const formatted = coursesController.__test_only__.fromDbFormat(invalid);
        expect(formatted).not.toHaveProperty('invalidProp');
    });
});
