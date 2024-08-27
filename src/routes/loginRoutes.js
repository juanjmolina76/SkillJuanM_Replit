const express = require('express')
const router = express.Router()//crea un nuevo enrutador de express
const loginController = require('../controlers/loginController')//require('./../controlers/loginController')

router.post('/registro', loginController.registro)
router.post('/login', loginController.login)
router.get('/logout', loginController.logout)
router.get('/verificarToken/:token', loginController.verificarToken)

module.exports = router