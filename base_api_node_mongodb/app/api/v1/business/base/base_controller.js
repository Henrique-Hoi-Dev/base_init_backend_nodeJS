const BaseResourceController = require('../../base/base_resource_controller');
const ExampleService = require('./base_service');
const HttpStatus = require('http-status');

class ExampleController extends BaseResourceController {
    constructor() {
        super();
        this._baseService = new ExampleService();
    }

    async baseFunction(req, res, next) {
        try {
            const data = await this._baseService.baseFunctionality(req.body, req.query);
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (error) {
            next(this.handleError(error));
        }
    }
}

module.exports = ExampleController;
