import { Request, Response, NextFunction } from 'express';
import BaseResourceController from '../../base/base_resource_controller';
import ExampleService from './base_service';
import HttpStatus from 'http-status';

class ExampleController extends BaseResourceController {
    protected _baseService: ExampleService;

    constructor() {
        super();
        this._baseService = new ExampleService();
    }

    async baseFunction(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await this._baseService.baseFunctionality(req.body, req.query);
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (error) {
            next(this.handleError(error));
        }
    }
}

export default ExampleController;

