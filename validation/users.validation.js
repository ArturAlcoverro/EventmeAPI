const Joi = require('joi');

async function search(req, res, next) {
    const schema = Joi.object().keys({
        s: Joi.string().required()
    })
    validate(schema, req.query, next)
}

async function id(req, res, next) {
    const schema = Joi.object().keys({
        ID: Joi.number()
    })
    validate(schema, req.params, next)
}

function validate(schema, params, next) {
    const result = schema.validate(params)
    if (result.error)
        return next({
            status: 400,
            error: result.error.details[0].message,
        })
    return next()
}

module.exports = { search, id }