import BaseController from './base_controller';
import logger from '../../../utils/logger';
import { Model } from 'sequelize';

class BaseResourceController extends BaseController {
    protected model?: Model;

    constructor(model?: Model, errorHandler?: any) {
        super(errorHandler);
        this.model = model;
        this.logger = logger;
    }
}

export default BaseResourceController;

