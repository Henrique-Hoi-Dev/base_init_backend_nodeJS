import { Router, Request, Response } from 'express';
import validator from '../../../../utils/validator';
import ExampleController from './base_controller';
import validation from './base_validation';
import middleware from '../../../../main/middleware';

const exampleController = new ExampleController();

export default (router: Router): Router => {
    router
        .route('/name-router')
        .post(
            middleware.ensureAuthorization,
            middleware.verifyToken,
            validator(validation.validador),
            exampleController.baseFunction.bind(exampleController)
        );

    return router;
};

