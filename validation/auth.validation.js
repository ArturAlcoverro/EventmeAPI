const Joi = require('joi');

function login(req, res, next) {
    const schema = Joi.object().keys({
        email: Joi.string().email({ tlds: { allow: false } }).required(),
        password: Joi.string().required()
    })

    const result = schema.validate(req.body)
    if (result.error) return next({
        status: 400,
        error: result.error.details[0].message,
    });
    else next()
}

module.exports = { login }