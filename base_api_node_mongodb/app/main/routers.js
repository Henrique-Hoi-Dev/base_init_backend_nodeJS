const baseRouter = require('../api/v1/business/base/base_router');
const { Router } = require('express');

const addRouters = (router) => {
    router.route('/health').get((req, res) => {
        return res.status(200).send();
    });

    router.use('/base', baseRouter(Router()));

    return router;
};

module.exports = addRouters;
