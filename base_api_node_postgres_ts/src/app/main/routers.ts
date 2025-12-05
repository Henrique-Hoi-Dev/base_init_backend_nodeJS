import { Router } from 'express';
import baseRouter from '../api/v1/business/base/base_router';

const addRouters = (router: Router): Router => {
    router.route('/health').get((req, res) => {
        return res.status(200).send();
    });

    router.use('/base', baseRouter(Router()));

    return router;
};

export default addRouters;

