const express = require('express')
const router = express.Router()//crea un nuevo enrutador de express
const loginController = require('../controlers/loginController')//require('./../controlers/loginController')

const requisitos = require('../validations/configValidaciones')
const validate = require('../validations/validacion')
const validateRegistro = require('../validations/validacionRegistro')

router.post('/registro', requisitos.registro, validateRegistro, loginController.registro)//validaciones
router.post('/login', requisitos.login, validate, loginController.login)//validaciones
router.get('/logout', loginController.logout)
router.get('/verificarToken/:token', loginController.verificarToken)

module.exports = router