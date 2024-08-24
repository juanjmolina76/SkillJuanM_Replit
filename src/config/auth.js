const jwt = require('jsonwebtoken')
const jwtconfig = require('./jwtconfig')//tenia un error
//middleware de autenticacion
module.exports = (req, res, next) => {
        const authHeader = req.headers['authorization']//obtiene el header (encabezado) de la autorizacion
        if(!authHeader) return res.status(403).send({auth: false, message: 'No se proveyó un token'})// si no hay token en el encabezado
        console.log(authHeader)
        const token = authHeader.split(' ')[1]//extree el token del encabezado(formato "Bearer <token>")
        if(!token) return res.status(403).send({auth: false, message: 'Token errado'})// si el token no está bienr formado envía una respuesta de error 403
        jwt.verify(token, jwtconfig.secretKey, (err, coded)=>{//verifica el token usando la clave secreta
            if (err) return res.status(403).send({auth: false, message: 'Token no autorizado'})//si hay un error en la verificacion en via una respuesta error 403
            next()
        })

}