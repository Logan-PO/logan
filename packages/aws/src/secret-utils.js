const AWS = require('./base');

const secrets = new AWS.SecretsManager({ apiVersion: '2017-10-17' });

/**
 * Fetches a secret from the Secrets Manager
 * @param {String} name
 * @returns {Promise<Object>}
 */
async function getSecret(name) {
    const secretValue = await secrets.getSecretValue({ SecretId: name }).promise();
    if (secretValue.SecretString) {
        return JSON.parse(secretValue.SecretString);
    } else {
        return null;
    }
}

module.exports = {
    getSecret,
};
