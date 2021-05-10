const Joi = require('joi');


async function create(req, res, next) {
    const schema = Joi.object({
        content: Joi.string().trim().required(),
        user_id_send: Joi.number().required(),
        user_id_recived: Joi.number().required()
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


const idUser = async function (req, res, next) {
    const schema = Joi.object({
        ID_USER: Joi.number(),
    })
    
    const result = schema.validate(req.params, { stripUnknown: true })

    if (result.error)
        return next({
            status: 400,
            error: result.error.details[0].message,
        })
    return next()
}

module.exports = { create, idUser }