const validator = require('../../../../utils/validator');
const Integra360Controller = require('./integra360_controller');
const validation = require('./integra360_validation');
const { ensureAuthorization, verifyKeycloackInternalToken } = require('../../../../main/middleware');

const integra360Controller = new Integra360Controller();

module.exports = (router) => {
    router
        .route('/users')
        .post(
            ensureAuthorization,
            verifyKeycloackInternalToken,
            validator(validation.emailAndCpfValidator),
            integra360Controller.searchUserVtex.bind(integra360Controller)
        );

    return router;
};
