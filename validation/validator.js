
function validate(schema, params, next) {
    const result = schema.validate(params)
    if (result.error) return next({
        status: 400,
        error: result.error.details[0].message,
    })
    else next()
}

module.exports = { validate }