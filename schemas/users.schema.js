import joi from 'joi';

export default {
    registration: {
        body: joi.object({
            email: joi.string().email().required(),
            password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
            username: joi.string().min(2).max(10).required(),
            address: joi.object({
                city: joi.string().required(),
                state: joi.string().required(),
                country: joi.string().required(),
            }).allow(null).optional(),
        }),
    },

    login: {
        body: joi.object({
            email: joi.string().email().required(),
            password: joi.string().min(8).max(32).required(),
        }),
    },
}
