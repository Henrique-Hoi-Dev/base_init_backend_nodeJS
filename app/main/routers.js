const integra360Router = require('../api/v1/business/integra360/integra360_router');
const { Router } = require('express');

const addRouters = (router) => {
    router.route('/health').get((req, res) => {
        res.setHeader('csrf-token', req.csrfToken());
        return res.status(200).send();
    });

    router.use('/integra360', integra360Router(Router()));

    return router;
};

module.exports = addRouters;
