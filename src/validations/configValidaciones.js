const { body } = require ('express-validator')//VIDEO 36 Cierrede cursada (hasta 1:00 hs aprox
const { conn } = require ('../db/dbconnect')

const login = [

    body('user')
    .notEmpty()
    .withMessage('El campo de usuario no puede estar vacio')
    .isLength({min: 3, max: 15})
    .withMessage('El campo de usuario debe tener 3 caracteres minimo y 15 maximo'),

    body('password').isLength({min: 5 }).withMessage('El campo debe tener minimo 5 caracteres')
]

const registro = [
    body("user")
        .isLength({min: 3})
        .withMessage("Ingrese un usuario valido")
        .bail()
        .custom((value,{req}) => {
            return new Promise(async (resolve, reject)=> {
                try {
                    const [usuarioExiste] = await conn.query (`SELECT * FROM usuario WHERE username = '${value}'`)
                if (usuarioExiste){
                    return reject()
                }else{
                    return resolve()
                }
                } catch (error) {
                    console.log(error)
                }
            })
        })
        .withMessage("Usuario ya existe"),

    body("password")
        .isStrongPassword({
            minLength: 8,
            minUppercase: 1,
            minNumbers: 2,
            minSymbols: 1,
        })
        .withMessage('Ingrese un password valido')
        .custom((value, {req}) => value === req.body.password2)
        .withMessage('No coincide el password')

]

module.exports = {
    login,
    registro
 }