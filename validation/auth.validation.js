const Joi = require('joi');
const validator = require("./validator")

function login(req, res, next) {
    const schema = Joi.object().keys({
        email: Joi.string().email({ tlds: { allow: false } }).required(),
        password: Joi.string().required()
    })
    validator.validate(schema, req.body, next)
}

module.exports = { login }