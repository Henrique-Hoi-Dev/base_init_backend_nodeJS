import BaseErrorHandler from '../api/v1/base/base_error_handler';
import errorMapping from '../utils/error_mapping';
import message from '../../locale/error/en.json';

class ValidationsErrorHandler extends BaseErrorHandler {
    errorResponse(data: any): any {
        if (data.details) {
            const status = data.status || data.statusCode;
            const keys = Object.keys(data.details);
            const errors: any[] = [];
            keys.forEach((key) => {
                const err =
                    data.details[key] &&
                    data.details[key].map((d: any) => {
                        return { message: d.message, key: d.context.key, local: key };
                    });

                if (err) errors.push(...err);
            });

            const errorName = data.name === 'ValidationError' ? 'VALIDATION_ERROR' : data.name;
            return {
                message: (message as any)[errorName],
                key: errorName,
                errorCode: errorMapping[errorName as keyof typeof errorMapping],
                status,
                errors
            };
        }

        return super.errorResponse(data);
    }
}

export default ValidationsErrorHandler;

