const { conn } = require('../db/dbconnect')
const jtoken = require ('jsonwebtoken')
const crypt = require('bcryptjs')
const jwtconfig = require('./../config/jwtconfig.js')

module.exports = {
    registro: async (req, res)=> {//en mi bd, la tabla usuario tiene 3 columnas + id_rol
        const {user, email, password} = req.body
        const encriptado = await crypt.hash(password, 5)
        const [creado] = await conn.query('INSERT INTO usuario (username, email, password, id_rol) VALUES (?,?,?,?);', [user, email, encriptado, 2])//cambiar a 1 para crear admin, sino dejar en 2 para usuarios
        console.log(creado)
        res.redirect('/login.html')
},
    login: async (req,res)=> {
        // VER SI TENGO Q AGREGAR EL CAMPO mail AL LOGIN ***
        //let token // BORRAR ??
        const {user, password} = req.body//extrae el ombre de ususario y la contraseña del cuerpo de la solicitud
        const[[valido]] = await conn.query(`SELECT * FROM usuario WHERE username = ?`, user)
        console.log(valido)//imprime en la consola despues de "Estoy arriba en el puerto 8080"

        if (valido === undefined){
            console.log(valido)

        	res.status(404).send('Usuario no encontrado')
		} 
        else if (!(await crypt.compare(password, valido.password))){
            console.log(valido.password)//imprime el password encriptado aunque el ingresado esté incorrecto
			res.status(401).send({auth: true, token: null})
		}
         else { // Error en clase: escribí "expriresIn" en lugar de "expiresIn" y no se genera bien el token
			
            token = jtoken.sign({id: valido.id}, jwtconfig.secretKey, {expiresIn: jwtconfig.tokenExpiresIn})
			req.session.userId = valido.id //faltaba esta linea
            res.status(201).send({auth: true, token, idRol: valido.id_rol}) //***AGREGADO desde token,... */
            console.log(req.session.userId)
		}
},

    logout: async (req, res)=> {
        req.session.userId = null  // DESTRUYO EL ID valido (lo pongo nulo) destroy
        console.log(req.session.userId)
        res.redirect('/login.html')
},

//agrego VERIFICAR TOKEN

verificarToken: async (req, res) => {
    try {

        const token = req.params.token
        const valido = jtoken.verify(token, jwtconfig.secretKey)

        res.status(200).send({ auth: true })
    } catch (error) {
        res.status(500).send({ auth: false, message: "Token Expirado" })
        
    }
}
}