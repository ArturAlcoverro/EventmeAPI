const Joi = require('joi');

async function login(req, res, next) {
    const schema = Joi.object().keys({
        email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
        password: Joi.string().required()
    })

    const result = schema.validate(req.body, { stripUnknown: true })

    if (result.error)
        return next({
            status: 400,
            error: result.error.details[0].message,
        })

    req.body = result.value
    return next()
}

async function register(req, res, next) {
    const schema = Joi.object().keys({
        name: Joi.string().trim().required(),
        last_name: Joi.string().trim().required(),
        email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
        password: Joi.string().required()
    })

    const result = schema.validate(req.body, { stripUnknown: true })

    if (result.error)
        return next({
            status: 400,
            error: result.error.details[0].message,
        })

    req.body = result.value
    return next()
}

module.exports = { login, register }