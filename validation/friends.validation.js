const Joi = require('joi');

async function id(req, res, next) {
    const schema = Joi.object().keys({
        ID: Joi.number()
    })
    const result = schema.validate(req.params)

    if (result.error)
        return next({
            status: 400,
            error: result.error.details[0].message,
        })

    return next()
}

module.exports = { id }