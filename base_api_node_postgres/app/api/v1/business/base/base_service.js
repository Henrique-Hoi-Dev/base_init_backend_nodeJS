const baseModel = require('./base_model');
const BaseService = require('../../base/base_service');

class UsersService extends BaseService {
    constructor() {
        super();
        this._usersModel = baseModel();
    }

    async baseFunctionality() {}

    _updateHours(numOfHours, date = new Date()) {
        const dateCopy = new Date(date.getTime());

        dateCopy.setHours(dateCopy.getHours() - numOfHours);

        return dateCopy;
    }

    _handleSequelizeError(error) {
        if (error.name === 'SequelizeValidationError') {
            const firstError = error.errors[0];
            const err = new Error(firstError.message);
            err.field = firstError.path;
            err.status = 422;
            throw err;
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            const firstError = error.errors[0];
            const err = new Error(`${firstError.path} already exists`);
            err.field = firstError.path;
            err.status = 409;
            throw err;
        }
        throw error;
    }
}

module.exports = UsersService;
