const _ = require('lodash');
const bodyParser = require('body-parser');

const handlers = {
    '/': {
        get: {
            handler: require('./src/hello-world').rootHandler,
        },
    },
    '/auth/verify': {
        post: {
            handler: require('./src/verify-id-token').verifyIdToken,
        },
    },
};

function route(app) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    for (const path of _.keys(handlers)) {
        for (const method of _.keys(handlers[path])) {
            app[method](path, handlers[path][method].handler);
        }
    }
}

module.exports = {
    route,
};
