const { validationResult } = require('express-validator')

const validationRegistro = (req, resp, next) => {
    console.log('validateRegistro')
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return resp.status(400).json({ errors: errors.array() })//podria mandar un html 

    }
    next()// si no hay errores voy al controlador 
}

module.exports = validationRegistro

