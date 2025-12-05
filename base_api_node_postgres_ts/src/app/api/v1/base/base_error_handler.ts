import errorMapping from '../../../utils/error_mapping';

class BaseErrorHandler {
    errorResponse(data: any): any {
        const defaultMessage = 'VALIDATION_ERROR';
        const status = data?.status ?? 422;
        const message = data?.key ?? defaultMessage;
        const error_code = errorMapping[message as keyof typeof errorMapping];

        return {
            status,
            errors: [{ error_code, message }]
        };
    }
}

export default BaseErrorHandler;

