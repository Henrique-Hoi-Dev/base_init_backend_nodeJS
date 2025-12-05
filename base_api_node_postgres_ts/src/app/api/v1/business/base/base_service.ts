import BaseService from '../../base/base_service';
import getBaseModel from './base_model';

class ExampleService extends BaseService {
    protected _model: any;

    constructor() {
        super();
        this._model = getBaseModel();
    }

    async baseFunctionality(body: any, query: any): Promise<any> {
        // Implement your business logic here
        return {};
    }

    protected _handleSequelizeError(error: any): void {
        if (error.name === 'SequelizeValidationError') {
            const firstError = error.errors[0];
            const err: any = new Error(firstError.message);
            err.field = firstError.path;
            err.status = 422;
            throw err;
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            const firstError = error.errors[0];
            const err: any = new Error(`${firstError.path} already exists`);
            err.field = firstError.path;
            err.status = 409;
            throw err;
        }
        throw error;
    }
}

export default ExampleService;

