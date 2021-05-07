const Joi = require('joi');
const validator = require("./validator")

async function search(req, res, next) {
    const schevma = Joi.object().keys({
        s: Joi.string().required()
    })
    validator.validate(schema, req.query, next)
}

module.exports = { search }