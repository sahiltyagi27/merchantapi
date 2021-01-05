'use strict';

const Promise = require('bluebird');
const crypto = require('crypto');
const request = require('request-promise');
const validator = require('validator');
var winston = require('winston');
require('winston-loggly-bulk');

exports.logEvents = (message) => {
    var error = Object.assign({}, message);
    error.functionName = 'MerchantWebApi';
    winston.configure({
        transports: [
            new winston.transports.Loggly({
                token: process.env.LOGGLY_TOKEN,
                subdomain: 'vourity',
                tags: ['Winston-NodeJS'],
                json: true
            })
        ]
    });

    winston.log('error', error);
};

exports.logInfo = (message) => {
    var logMessage = Object.assign({}, message);
    logMessage.functionName = 'MerchantWebApi';
    logMessage.code = 200;
    winston.configure({
        transports: [
            new winston.transports.Loggly({
                token: process.env.LOGGLY_TOKEN,
                subdomain: 'vourity',
                tags: ['Winston-NodeJS'],
                json: true
            })
        ]
    });

    winston.info(logMessage);
};

exports.handleError = (context, error) => {
    context.log.error(error);
    switch (error.constructor) {
        case errors.ActionCodeFormatError:
        case errors.PriceplanNotFoundError:
        case errors.InvalidUUIDError:
        case errors.StripeError:
            this.logKnownErrors(context, error);
            this.setContextResError(context, error);
            break;
        default:
            this.handleDefaultError(context, error);
            break;
    }
};

exports.validateUUIDField = (context, id, message = 'The id specified in the URL does not match the UUID v4 format.') => {
    return new Promise((resolve, reject) => {
        if (validator.isUUID(`${id}`, 4)) {
            resolve();
        } else {
            reject(
                new errors.InvalidUUIDError(message, 400)
            );
        }
    });
};
exports.setContextResError = (context, error) => {
    const body = {
        code: error.code,
        description: error.message,
        reasonPhrase: error.name
    };

    context.res = {
        status: error.code,
        body: body
    };

    if (error.name !== 'StripeError') {
        this.logEvents(body);
    }
};

exports.handleDefaultError = (context, error) => {
    console.log(error.error);
    if (error.type === 'StripeInvalidRequestError') {
        let message;
        if (error.message) {
            message = error.message;
        } else {
            message = 'StripeInvalidRequestError';
        }
        this.setContextResError(
            context,
            new errors.StripeError(
                message,
                error.statusCode
            )
        );
    } else {
        const response = error.error;
        if (response && response.reasonPhrase) {
            if (voucherApiErrorCodes.includes(response.reasonPhrase)) {
                const errorFormatted = new errors.VoucherApiError(
                    response.reasonPhrase,
                    response.description,
                    response.code
                );

                this.setContextResError(
                    context,
                    errorFormatted
                );
                this.logKnownErrors(context, errorFormatted);
            } else {
                handleMerchantWebApiServerError(error, context);
            }
        } else {
            handleMerchantWebApiServerError(error, context);
        }
    }
};
exports.authenticateRequest = (context, req) => {
    if (req.headers.authorization) {
        try {
            if (this.decodeToken(req.headers.authorization).exp <= new Date()) {
                return true;
            }
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
};

exports.decodeToken = (token) => {
    try {
        const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
        return decodedToken;
    } catch (e) {
        return e;
    }
};
