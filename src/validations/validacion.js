const { validationResult } = require('express-validator')

const validation = (req, resp, next) => {
    console.log('validate')
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return resp.status(400).json({ errors: errors.array() })

    }
    next()
}

module.exports = validation

