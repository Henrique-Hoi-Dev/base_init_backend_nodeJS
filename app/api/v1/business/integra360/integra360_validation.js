const { Joi } = require('express-validation');
const validateCpf = require('../../../../utils/validateCpf');

const dateIsAfter = (value, helpers) => {
    const data = helpers.state.ancestors[0];
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (startDate >= endDate) throw new Error('must be after "startDate"');
    return value;
};

module.exports = {
    updateSocialMedia: {
        body: Joi.object({
            socials: Joi.object({
                instagram: Joi.string(),
                tiktok: Joi.string(),
                twitter: Joi.string(),
                youtube: Joi.string(),
                facebook: Joi.string()
            }).required(),
            mainSocial: Joi.string()
                .uppercase()
                .valid('INSTAGRAM', 'TIKTOK', 'TWITTER', 'YOUTUBE', 'FACEBOOK')
                .required(),
            contentType: Joi.array().items(Joi.string()).required(),
            contentTypeOthers: Joi.string().max(255)
        })
    },
    getUserByDocument: {
        params: Joi.object({
            cpf: Joi.string().replace(/\D/g, '').custom(validateCpf).required()
        })
    },

    emailAndCpfValidator: {
        body: Joi.object({
            cpfs: Joi.array().items(Joi.string().replace(/\D/g, '').custom(validateCpf).optional()).optional(),
            emails: Joi.array().items(Joi.string().email().optional()).optional()
        })
    },
    emailRemove: {
        body: Joi.object({
            removeTotalEmails: Joi.boolean().optional()
        })
    },
    emails: {
        body: Joi.object({
            emails: Joi.array()
                .items(
                    Joi.object({
                        name: Joi.string().required(),
                        email: Joi.string().email().required()
                    })
                )
                .optional()
        })
    },

    getBalanceUser: {
        query: Joi.object({
            cpf: Joi.string().replace(/\D/g, '').custom(validateCpf).required()
        })
    },

    getUserDevergents: {
        query: Joi.object({
            search: Joi.string(),
            status: Joi.string().uppercase().valid('CORRECTED', 'DIVERGENT'),
            startDate: Joi.string().isoDate().trim(),
            endDate: Joi.string()
                .isoDate()
                .trim()
                .when('startDate', {
                    is: Joi.exist(),
                    then: Joi.string().isoDate().custom(dateIsAfter)
                }),
            page: Joi.number().integer().min(1),
            limit: Joi.number().integer().min(1)
        })
    },

    getUserDevergentId: {
        params: Joi.object({
            id: Joi.string().trim().required()
        })
    },

    getGiftcardId: {
        params: Joi.object({
            giftcardId: Joi.string().trim().required()
        })
    },

    getEmail: {
        params: Joi.object({
            email: Joi.string().trim().required()
        })
    },

    notificationMessageId: {
        params: Joi.object({
            messageId: Joi.string().trim().required()
        })
    },

    get: {
        query: Joi.object({
            page: Joi.number().min(1),
            limit: Joi.number().min(1)
        })
    },

    settings: {
        body: Joi.object({
            notification: Joi.boolean().optional(),
            maxNumberDivergencesNotify: Joi.number().optional(),
            userAnalyticsAutomatic: Joi.boolean().optional(),
            correctionAutomatic: Joi.boolean().optional(),
            notificationListEmails: Joi.array()
                .items(
                    Joi.object({
                        name: Joi.string().required(),
                        email: Joi.string().email().required()
                    })
                )
                .optional()
        })
    }
};
