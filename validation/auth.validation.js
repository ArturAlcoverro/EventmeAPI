const Joi = require('joi');
const validator = require("./validator")

async function login(req, res, next) {
    const schema = Joi.object().keys({
        email: Joi.string().email({ tlds: { allow: false } }).required(),
        password: Joi.string().required()
    })
    validator.validate(schema, req.body, next)
}

async function register(req, res, next) {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email({ tlds: { allow: false } }).required(),
        password: Joi.string().required()
    })
    validator.validate(schema, req.body, next)
}

module.exports = { login, register }