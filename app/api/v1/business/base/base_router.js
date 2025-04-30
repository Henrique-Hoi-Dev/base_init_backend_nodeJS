const validator = require('../../../../utils/validator');
const BaseController = require('./base_controller');
const validation = require('./base_validation');
const { ensureAuthorization, verifyKeycloackInternalToken } = require('../../../../main/middleware');

const baseController = new BaseController();

module.exports = (router) => {
    router
        .route('/name-router')
        .post(
            ensureAuthorization,
            verifyKeycloackInternalToken,
            validator(validation.validador),
            baseController.searchUserVtex.bind(baseController)
        );

    return router;
};
