const Integra360UsersModel = require('./integra360_users_model');
const Integra360UsersDivergentsModel = require('./integra360_users_divergent_model');
const BaseService = require('../../base/base_service');
const HttpStatus = require('http-status');

class UsersService extends BaseService {
    constructor() {
        super();
        this._usersModel = Integra360UsersModel;
        this._usersDivergentsModel = Integra360UsersDivergentsModel;
    }

    _updateHours(numOfHours, date = new Date()) {
        const dateCopy = new Date(date.getTime());

        dateCopy.setHours(dateCopy.getHours() - numOfHours);

        return dateCopy;
    }

    _checkUserExists(user) {
        if (!user) {
            const err = new Error('USER_NOT_FOUND');
            err.status = HttpStatus.UNPROCESSABLE_ENTITY;
            throw err;
        }
    }

    _handleMongoError(error) {
        const keys = Object.keys(error.errors);
        const err = new Error(error.errors[keys[0]].message);
        err.field = keys[0];
        err.status = 409;
        throw err;
    }
}

module.exports = UsersService;
