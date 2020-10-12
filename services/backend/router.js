const _ = require('lodash');
const bodyParser = require('body-parser');
const auth = require('./utils/auth');
const usersController = require('./src/users-controller');
const tasksController = require('./src/tasks-controller');
const assignmentsController = require('./src/assignments-controller');
const termsController = require('./src/terms-controller');
const holidaysController = require('./src/holidays-controller');
const coursesController = require('./src/courses-controller');
const sectionsController = require('./src/sections-controller');

const unauthedRoutes = {
    '/ping': {
        get: require('./src/ping').ping,
    },
    '/auth/verify': {
        post: require('./src/verify-id-token').verifyIdToken,
    },
    '/users': {
        post: {
            action: auth.UNAUTHORIZED_ACTIONS.CREATE_USER,
            handler: usersController.createUser,
        },
    },
};

const authedRoutes = {
    '/users/:uid': {
        get: usersController.getUser,
        put: usersController.updateUser,
        delete: usersController.deleteUser,
    },
    '/assignments/:aid': {
        get: assignmentsController.getAssignment,
        put: assignmentsController.updateAssignment,
        delete: assignmentsController.deleteAssignment,
    },
    '/assignments': {
        get: assignmentsController.getAssignments,
        post: assignmentsController.createAssignment,
    },
    '/tasks/:tid': {
        get: tasksController.getTask,
        put: tasksController.updateTask,
        delete: tasksController.deleteTask,
    },
    '/tasks': {
        get: tasksController.getTasks,
        post: tasksController.createTask,
    },
    '/terms/:tid': {
        get: termsController.getTerm,
        put: termsController.updateTerm,
        delete: termsController.deleteTerm,
    },
    '/terms': {
        get: termsController.getTerms,
        post: termsController.createTerm,
    },
    '/holidays/:hid': {
        get: holidaysController.getHoliday,
        put: holidaysController.updateHoliday,
        delete: holidaysController.deleteHoliday,
    },
    '/holidays': {
        get: holidaysController.getHolidays,
        post: holidaysController.createHoliday,
    },
    '/courses/:cid': {
        get: coursesController.getCourse,
        put: coursesController.updateCourse,
        delete: coursesController.deleteCourse,
    },
    '/courses': {
        get: coursesController.getCourses,
        post: coursesController.createCourse,
    },
    '/sections/:sid': {
        get: sectionsController.getSection,
        put: sectionsController.updateSection,
        delete: sectionsController.deleteSection,
    },
    '/sections': {
        get: sectionsController.getSections,
        post: sectionsController.createSection,
    },
};

/**
 * Sets up middleware and connects routes to the Express app
 * @param app
 */
function route(app) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    const handlers = _.merge(
        {},
        _.mapValues(unauthedRoutes, methodMap =>
            _.mapValues(methodMap, value => {
                if (typeof value === 'function') return { handler: value };
                return value;
            })
        ),
        _.mapValues(authedRoutes, methodMap =>
            _.mapValues(methodMap, value => {
                if (typeof value === 'function') return { authRequired: true, handler: value };
                return { authRequired: true, ...value };
            })
        )
    );

    for (const path of _.keys(handlers)) {
        for (const method of _.keys(handlers[path])) {
            app[method](path, async (req, res, next) => {
                try {
                    await auth.handleAuth(req, handlers[path][method].authRequired, handlers[path][method].action);
                    await handlers[path][method].handler(req, res, next);
                } catch (e) {
                    res.status(500).json({ error: e.message, stack: e.stack });
                }
            });
        }
    }
}

module.exports = {
    route,
};
