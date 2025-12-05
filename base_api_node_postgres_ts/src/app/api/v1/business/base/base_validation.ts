import { Joi } from 'express-validation';

export default {
    validador: {
        body: Joi.object({
            params: Joi.string()
        })
    }
};

