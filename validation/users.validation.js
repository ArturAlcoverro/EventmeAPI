const Joi = require('joi');
const validator = require("./validator")

function search(req, res, next) {
    console.log("SEARCH_VALIDATOR")
    const schema = Joi.object().keys({
        s: Joi.string().required()
    })
    validator.validate(schema, req.query, next)
}

module.exports = { search }