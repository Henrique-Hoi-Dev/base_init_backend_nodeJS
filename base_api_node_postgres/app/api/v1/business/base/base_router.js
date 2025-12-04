const validator = require('../../../../utils/validator');
const ExampleController = require('./base_controller');
const validation = require('./base_validation');
const { ensureAuthorization, verifyToken } = require('../../../../main/middleware');

const exampleController = new ExampleController();

module.exports = (router) => {
    router
        .route('/name-router')
        .post(
            ensureAuthorization,
            verifyToken,
            validator(validation.validador),
            exampleController.baseFunction.bind(exampleController)
        );

    return router;
};
