const baseModel = require('./base_model');
const BaseService = require('../../base/base_service');

class ExampleService extends BaseService {
    constructor() {
        super();
        this._model = baseModel;
    }

    async baseFunctionality() {}

    _handleMongoError(error) {
        const keys = Object.keys(error.errors);
        const err = new Error(error.errors[keys[0]].message);
        err.field = keys[0];
        err.status = 409;
        throw err;
    }
}

module.exports = ExampleService;
