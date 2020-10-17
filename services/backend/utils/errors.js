class LoganError extends Error {
    constructor(message, code = 600) {
        super(message);
        this.code = code;
        if (Error.captureStackTrace) Error.captureStackTrace(this, LoganError);
    }
}

class NotFoundError extends LoganError {
    constructor(message) {
        super(message, 601);
        if (Error.captureStackTrace) Error.captureStackTrace(this, NotFoundError);
    }
}

class ValidationError extends LoganError {
    constructor(message, code = 602) {
        super(message, code);
        if (Error.captureStackTrace) Error.captureStackTrace(this, ValidationError);
    }
}

class MissingPropertyError extends ValidationError {
    constructor(properties, location) {
        const wording = properties.length === 1 ? 'property' : 'properties';
        const locationName = location ? `in ${location}` : '';

        super(`Missing required ${wording}${locationName}: ${properties.join(', ')}`, 603);

        if (Error.captureStackTrace) Error.captureStackTrace(this, MissingPropertyError);
    }
}

class AuthorizationError extends LoganError {
    constructor(message) {
        super(message, 610);
        if (Error.captureStackTrace) Error.captureStackTrace(this, AuthorizationError);
    }
}

class PermissionDeniedError extends LoganError {
    constructor(message) {
        super(message, 611);
        if (Error.captureStackTrace) Error.captureStackTrace(this, PermissionDeniedError);
    }
}

module.exports = {
    LoganError,
    NotFoundError,
    ValidationError,
    MissingPropertyError,
    AuthorizationError,
    PermissionDeniedError,
};
