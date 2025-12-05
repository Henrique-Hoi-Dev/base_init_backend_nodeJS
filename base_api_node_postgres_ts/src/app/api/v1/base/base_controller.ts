import HttpStatus from 'http-status';
import ev from 'express-validation';
import camelcaseKeys from 'camelcase-keys';
import ValidationsErrorHandler from '../../../main/validations_error_handler';
import BaseErrorHandler from './base_error_handler';
import logger from '../../../utils/logger';

const validationsErrorHandler = new ValidationsErrorHandler();

class BaseController {
    protected errorHandler?: BaseErrorHandler;
    protected validationsErrorHandler: ValidationsErrorHandler;
    protected httpStatus: typeof HttpStatus;
    protected logger: typeof logger;

    constructor(errorHandler?: BaseErrorHandler) {
        this.errorHandler = errorHandler;
        this.validationsErrorHandler = validationsErrorHandler;
        this.httpStatus = HttpStatus;
        this.logger = logger;
    }

    conflict(message?: string): Error {
        const errorMessage = message || 'Conflict';
        return this.errorResponse(this.httpStatus.CONFLICT, errorMessage);
    }

    forbidden(message?: string): Error {
        const errorMessage = message || 'Forbidden';
        return this.errorResponse(this.httpStatus.FORBIDDEN, errorMessage);
    }

    notFound(message?: string): Error {
        const errorMessage = message || 'Resource not found';
        return this.errorResponse(this.httpStatus.NOT_FOUND, errorMessage);
    }

    unauthorized(message?: string): Error {
        const errorMessage = message || 'Missing token or invalid token';
        return this.errorResponse(this.httpStatus.UNAUTHORIZED, errorMessage);
    }

    unprocessableEntity(message?: string): Error {
        const errorMessage = message || 'Invalid credentials or missing parameters';
        return this.errorResponse(this.httpStatus.UNPROCESSABLE_ENTITY, errorMessage);
    }

    errorResponse(status: number, message: string, { field, reasons }: { field?: string; reasons?: any } = {}): Error {
        const err: any = new Error();
        err.status = status || this.httpStatus.UNPROCESSABLE_ENTITY;
        err.message = message || 'Unprocessable entity';
        if (field) err.field = field;
        if (reasons) err.reasons = reasons;

        return err;
    }

    handleError(error: any): Error {
        if (error.response && error.config) return this.sanitizeError(error);

        if (this.errorHandler) {
            return this.errorHandler.errorResponse(error);
        }
        if (error instanceof ev.ValidationError || error.error === 'Unprocessable Entity') {
            return this.validationsErrorHandler.errorResponse(error);
        }
        let message = error.message || error.errorMessage;
        if (!message && typeof error.error === 'string') message = error.error;
        const status = error.status;
        return this.errorResponse(status, message, { field: error.field, reasons: error.reasons });
    }

    sanitizeError(e: any): any {
        const response = e.response;
        const config = e.config;

        return {
            message: e.message || (response.data && (response.data.errorMessage || response.data.message)),
            status: response.status,
            key: e.key,
            errors: { ...response.data, url: config.url, baseURL: config.baseURL, request: JSON.parse(config.data) }
        };
    }

    parseKeysToCamelcase(payload: any): any {
        payload = JSON.parse(JSON.stringify(payload));
        return camelcaseKeys(payload, { deep: true });
    }
}

export default BaseController;

