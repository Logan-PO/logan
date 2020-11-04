const _ = require('lodash');
const bodyParser = require('body-parser');
const auth = require('./utils/auth');
const { LoganError } = require('./utils/errors');
const controllers = require('./src/controllers');

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
            handler: controllers.users.createUser,
        },
    },
};

const authedRoutes = {
    '/users/:uid': {
        get: controllers.users.getUser,
        put: controllers.users.updateUser,
        delete: controllers.users.deleteUser,
    },
    '/assignments/:aid': {
        get: controllers.assignments.getAssignment,
        put: controllers.assignments.updateAssignment,
        delete: controllers.assignments.deleteAssignment,
    },
    '/assignments': {
        get: controllers.assignments.getAssignments,
        post: controllers.assignments.createAssignment,
    },
    '/tasks/:tid': {
        get: controllers.tasks.getTask,
        put: controllers.tasks.updateTask,
        delete: controllers.tasks.deleteTask,
    },
    '/tasks': {
        get: controllers.tasks.getTasks,
        post: controllers.tasks.createTask,
    },
    '/terms/:tid': {
        get: controllers.terms.getTerm,
        put: controllers.terms.updateTerm,
        delete: controllers.terms.deleteTerm,
    },
    '/terms': {
        get: controllers.terms.getTerms,
        post: controllers.terms.createTerm,
    },
    '/holidays/:hid': {
        get: controllers.holidays.getHoliday,
        put: controllers.holidays.updateHoliday,
        delete: controllers.holidays.deleteHoliday,
    },
    '/holidays': {
        get: controllers.holidays.getHolidays,
        post: controllers.holidays.createHoliday,
    },
    '/courses/:cid': {
        get: controllers.courses.getCourse,
        put: controllers.courses.updateCourse,
        delete: controllers.courses.deleteCourse,
    },
    '/courses': {
        get: controllers.courses.getCourses,
        post: controllers.courses.createCourse,
    },
    '/sections/:sid': {
        get: controllers.sections.getSection,
        put: controllers.sections.updateSection,
        delete: controllers.sections.deleteSection,
    },
    '/sections': {
        get: controllers.sections.getSections,
        post: controllers.sections.createSection,
    },
    '/reminders/:rid': {
        put: controllers.reminders.updateReminder,
        delete: controllers.reminders.deleteReminder,
    },
    '/reminders': {
        post: controllers.reminders.createReminder,
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
                    if (e instanceof LoganError) {
                        res.statusMessage = e.constructor.name;

                        res.status(e.code).json({
                            type: e.constructor.name,
                            error: e.message,
                        });
                    } else {
                        res.status(500).json({
                            error: e.message,
                            stack: e.stack,
                        });
                    }
                }
            });
        }
    }
}

module.exports = {
    route,
};
