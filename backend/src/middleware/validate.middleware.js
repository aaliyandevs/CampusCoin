function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      })
    }
    req.body = result.data
    next()
  }
}

function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      })
    }
    req.validatedQuery = result.data
    next()
  }
}

function validateIdParam(paramName = 'id') {
  return (req, res, next) => {
    const value = Number(req.params[paramName])
    if (!Number.isInteger(value) || value <= 0) {
      return res.status(400).json({ message: `Invalid ${paramName}` })
    }
    next()
  }
}

module.exports = validate
module.exports.validateQuery = validateQuery
module.exports.validateIdParam = validateIdParam
