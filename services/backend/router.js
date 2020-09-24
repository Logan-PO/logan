const _ = require('lodash');
const bodyParser = require('body-parser');
const auth = require('./utils/auth');
const usersController = require('./src/users-controller');
const tasksController = require('./src/tasks-controller');
const assignmentsController = require('./src/assignments-controller');
const termsController = require('./src/terms-controller');

// A map of routes/HTTP methods to handlers
// Add authRequired: true to a route to indicate that the user must be logged in
const handlers = {
    '/auth/verify': {
        post: {
            handler: require('./src/verify-id-token').verifyIdToken,
        },
    },
    '/users/:uid': {
        get: {
            authRequired: true,
            handler: usersController.getUser,
        },
        put: {
            authRequired: true,
            handler: usersController.updateUser,
        },
        delete: {
            authRequired: true,
            handler: usersController.deleteUser,
        },
    },
    '/users': {
        post: {
            action: auth.UNAUTHORIZED_ACTIONS.CREATE_USER,
            handler: usersController.createUser,
        },
    },
    '/assignments/:aid': {
        get: {
            authRequired: true,
            handler: assignmentsController.getAssignment,
        },
        put: {
            authRequired: true,
            handler: assignmentsController.updateAssignment,
        },
        delete: {
            authRequired: true,
            handler: assignmentsController.deleteAssignment,
        },
    },
    '/assignments': {
        get: {
            authRequired: true,
            handler: assignmentsController.getAssignments,
        },
        post: {
            authRequired: true,
            handler: assignmentsController.createAssignment,
        },
    },
    '/tasks/:tid': {
        get: {
            authRequired: true,
            handler: tasksController.getTask,
        },
        put: {
            authRequired: true,
            handler: tasksController.updateTask,
        },
        delete: {
            authRequired: true,
            handler: tasksController.deleteTask,
        },
    },
    '/tasks': {
        get: {
            authRequired: true,
            handler: tasksController.getTasks,
        },
        post: {
            authRequired: true,
            handler: tasksController.createTask,
        },
    },
    '/terms/:tid': {
        get: {
            authRequired: true,
            handler: termsController.getTerm,
        },
        put: {
            authRequired: true,
            handler: termsController.updateTerm,
        },
        delete: {
            authRequired: true,
            handler: termsController.deleteTerm,
        },
    },
    '/terms': {
        get: {
            authRequired: true,
            handler: termsController.getTerms,
        },
        post: {
            authRequired: true,
            handler: termsController.createTerm,
        },
    },
};

/**
 * Sets up middleware and connects routes to the Express app
 * @param app
 */
function route(app) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

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
