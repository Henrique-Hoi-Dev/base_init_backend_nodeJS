const ev = require('express-validation');
const _ = require('lodash');
const ValidationsErrorHandler = require('./validations_error_handler');
const validationsErrorHandler = new ValidationsErrorHandler();
const keys = require('../utils/error_mapping');
const { verifyToken } = require('../utils/jwt');

const logger = require('../utils/logger');

function logError(err, req, res, next) {
    try {
        if (err) {
            logger.error('logError');
            logger.error(err);
            logger.error(JSON.stringify(err, null, 2));
            return next(err);
        } else {
            return next();
        }
    } catch (error) {
        logger.error('logError catch');
        logger.error(error);

        if (err) {
            return next(err);
        } else {
            return next();
        }
    }
}

function handleError(err, req, res, next) {
    if (err) {
        if (err.response) res.status(err.response.status).json(err.response.data);
        err.key = err.key ? err.key : err.message;
        err.errorCode = keys[err.key];
        err.message = res.__(err.message);

        if (err instanceof ev.ValidationError || err.error === 'Unprocessable Entity') {
            err = validationsErrorHandler.errorResponse(err);
        } else if (err instanceof Error) {
            err = _.pick(err, [
                'message',
                'status',
                'key',
                'errorCode',
                'local',
                'field',
                'reasons',
                'registered',
                'rejected'
            ]);
        }

        const status = err.status || 422;
        delete err.status;
        res.status(status).json(err);
    } else {
        next();
    }
}

function throw404(req, res, next) {
    let err = new Error();
    err.status = 404;
    err.message = 'API_ENDPOINT_NOT_FOUND';
    next(err);
}

async function ensureAuthorization(req, res, next) {
    if (!req.header('Authorization')) {
        const err = new Error('INVALID_TOKEN');
        err.status = 401;
        next(err);
    }
    next();
}

module.exports = exports = {
    logError,
    handleError,
    throw404,
    ensureAuthorization,
    
};
