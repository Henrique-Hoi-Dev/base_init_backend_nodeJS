const BaseResourceController = require('../../base/base_resource_controller');
const Integra360Service = require('./integra360_service');
const HttpStatus = require('http-status');

class UsersController extends BaseResourceController {
    constructor() {
        super();
        this._integra360Service = new Integra360Service();
    }

    async searchUserVtex(req, res, next) {
        try {
            const data = await this._integra360Service._searchUserVtex(req.body, req.query);
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (error) {
            next(this.handleError(error));
        }
    }
}

module.exports = UsersController;
