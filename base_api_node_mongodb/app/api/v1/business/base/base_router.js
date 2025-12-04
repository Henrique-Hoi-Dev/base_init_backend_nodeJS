const validator = require('../../../../utils/validator');
const BaseController = require('./base_controller');
const validation = require('./base_validation');
const { ensureAuthorization, verifyToken } = require('../../../../main/middleware');

const baseController = new BaseController();

module.exports = (router) => {
    router
        .route('/name-router')
        .post(
            ensureAuthorization,
            verifyToken,
            validator(validation.validador),
            baseController.baseFunction.bind(baseController)
        );

    return router;
};
