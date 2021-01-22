const { makeHandler } = require('../../utils/wrap-handler');

const ping = makeHandler({
    config: { authRequired: false },
    handler: () => ({ success: true }),
});

module.exports = {
    ping,
};
