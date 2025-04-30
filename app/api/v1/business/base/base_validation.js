const { Joi } = require('express-validation');

module.exports = {
    validador: {
        body: Joi.object({
            params: Joi.string()
        })
    }
};
