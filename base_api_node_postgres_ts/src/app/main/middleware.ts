import { Request, Response, NextFunction } from 'express';
import ev from 'express-validation';
import _ from 'lodash';
import ValidationsErrorHandler from './validations_error_handler';
import keys from '../utils/error_mapping';
import { verifyToken as verifyTokenUtil } from '../utils/jwt';
import logger from '../utils/logger';

const validationsErrorHandler = new ValidationsErrorHandler();

function logError(err: any, req: Request, res: Response, next: NextFunction): void {
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

function handleError(err: any, req: Request, res: Response, next: NextFunction): void {
    if (err) {
        if (err.response) res.status(err.response.status).json(err.response.data);
        err.key = err.key ? err.key : err.message;
        err.errorCode = keys[err.key as keyof typeof keys];
        err.message = (res as any).__(err.message);

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

function throw404(req: Request, res: Response, next: NextFunction): void {
    const err: any = new Error();
    err.status = 404;
    err.message = 'API_ENDPOINT_NOT_FOUND';
    next(err);
}

async function ensureAuthorization(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.header('Authorization')) {
        const err: any = new Error('INVALID_TOKEN');
        err.status = 401;
        return next(err);
    }
    next();
}

async function verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            const err: any = new Error('INVALID_TOKEN');
            err.status = 401;
            return next(err);
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = verifyTokenUtil(token);
        (req as any).user = decoded;
        next();
    } catch (error) {
        const err: any = new Error('INVALID_TOKEN');
        err.status = 401;
        next(err);
    }
}

export default {
    logError,
    handleError,
    throw404,
    ensureAuthorization,
    verifyToken
};

