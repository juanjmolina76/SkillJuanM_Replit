const express = require('express')
const router = express.Router()
const controladores = require('../controlers/mainController')
//const path = require('path')

/*router.get ("/perfil", controladores.getListado)
    /*(req, res) => {
    res.sendFile(__dirname + '/public/perfil.html') // 1ero dirijo e pedido "/" al index
})
*/

const multer = require('multer')// (1º) LEVANTO el modulo multer que instalé con (npm install multer)(para guardar archivos)
//const path = require('path')

//(2º) CONFIGURO multer: el metodo diskStorage ejecuta multer en el objeto storage (crea internamente dos metodos particulares q configuran la carpeta donde se guardarán los archvivos 
// y con qué nombre se van a guardar...
// destination es el destino don de se van a guardar (la carpeta)
// y filename es el nombre con el cual se van a guradar los archivos)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `public/img/`)
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + "_" + file.originalname)
    }
})

const uploadFile = multer({ storage })//(3ª)LEVANTO LA CONFIGURACION... Guardo en la variable auploadFile la configuracion de multer
//falta ahora decir de qué manera ejecuto multer ,,, en cual de las rutas debe entrometerse al recibir el archivo (ENtre cual de las rutas de Routes interviniendo el post (el override))





router.get ('/proy/:nombre', controladores.getListado) 
//(4º)EJECUCION DE MULTER. entre la definicion de la ruta y la llamada al controlador. Defino el tipo de envio va a recibir (single es un solo archivo por ves) y le digo el nombre del campo 
//(el name del imput en el formulario)
router.post (`/proy/:nombre`, uploadFile.single('img'), controladores.crearRegistro)
//y la llamada al controlador
router.post (`/proy/:nombre`, controladores.crearRegistro)
    /*(req, res)=> {
    //console.log(req.body.create)
    //console.log(req.body)
    res.send(`<h2>Se hizo algo con ${req.body.create} en el create</h2><a href="/Proy/Digitales">Volver a la pagina anterior</a>`)
    //res.json(req.body.create)
})*/
/*
router.put ('/proy', (req, res)=> { 
     res.send(`<h2>Se hizo algo con ${req.body.actualizar} en el update</h2><a href="/Proy/Digitales">Volver a la pagina anterior</a>`)//podria usar PATCH
})
*/
router.delete ('/proy/:nombre', controladores.eliminar)

router.get ('/modificar/:id', controladores.getModificar)

router.put ('/modificar', controladores.actualizar)

module.exports = router
