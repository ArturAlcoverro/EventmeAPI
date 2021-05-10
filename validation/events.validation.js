const Joi = require('joi');

const create = async function (req, res, next) {
    const schema = Joi.object({
        name: Joi.string().trim().required(),
        location: Joi.string().trim().required(),
        description: Joi.string().trim().required(),
        eventStart_date: Joi.date().required(),
        eventEnd_date: Joi.date().required(),
        n_participators: Joi.number().required(),
        type: Joi.string().trim().required()
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

const update = create;

const createAssistance = async function (req, res, next) {
    const schema = Joi.object({
        puntuation: Joi.number().required(),
        comentary: Joi.string().trim().required(),
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

async function id_user(req, res, next) {
    const schema = Joi.object().keys({
        ID: Joi.number(),
        ID_USER: Joi.number(),
    })
    const result = schema.validate(req.params)

    if (result.error)
        return next({
            status: 400,
            error: result.error.details[0].message,
        })

    return next()
}

const updateAssistance = createAssistance;

module.exports = { create, update, createAssistance, updateAssistance, id, id_user }