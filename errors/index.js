'use strict';

/**
 * Base error for custom errors thrown by Consumer API function app.
 */
class BaseError extends Error {
    constructor (message, code) {
        super(message);
        this.name = 'ConsumerApiFunctionsBaseError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.BaseError = BaseError;

class ConsumerApiServerError extends BaseError {
    constructor (message, code) {
        super(message, code);
        this.name = 'ConsumerApiServerError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ConsumerApiServerError = ConsumerApiServerError;

class InvalidUUIDError extends BaseError {
    constructor (message, code) {
        super(message, code);
        this.name = 'InvalidUUIDError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.InvalidUUIDError = InvalidUUIDError;
class EmptyRequestBodyError extends BaseError {
    constructor (message, code) {
        super(message);
        this.name = 'EmptyRequestBodyError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.EmptyRequestBodyError = EmptyRequestBodyError;
class UserNotAuthenticatedError extends BaseError {
    constructor (message, code) {
        super(message);
        this.name = 'UserNotAuthenticatedError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.UserNotAuthenticatedError = UserNotAuthenticatedError;
class WebTemplateNotFoundError extends BaseError {
    constructor (message, code) {
        super(message);
        this.name = 'LandingPageNotFoundError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.WebTemplateNotFoundError = WebTemplateNotFoundError;
class MissingAccountMerchantID extends BaseError {
    constructor (message, code) {
        super(message);
        this.name = 'MissingAccountMerchantID';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.MissingAccountMerchantID = MissingAccountMerchantID;

class MissingMerchantID extends BaseError {
    constructor (message, code) {
        super(message);
        this.name = 'MissingMerchantID';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.MissingMerchantID = MissingMerchantID;

class FieldValidationError extends BaseError {
    constructor (message, code) {
        super(message);
        this.name = 'FieldValidationError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.FieldValidationError = FieldValidationError;
class MerchantLinkedError extends BaseError {
    constructor (message, code) {
        super(message);
        this.name = 'MerchantLinkedError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.MerchantLinkedError = MerchantLinkedError;

class MerchantNotFoundError extends BaseError {
    constructor (message, code) {
        super(message);
        this.name = 'MerchantNotFoundError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.MerchantNotFoundError = MerchantNotFoundError;
