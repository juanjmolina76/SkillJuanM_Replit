const express = require('express')
const router = express.Router()

const { body } = require ("express-validator");/*Agrego Express Validator*/ 

const controladores = require('../controlers/mainController');



//const path = require('path')
const multer = require('multer')// (1º) LEVANTO el modulo multer que instalé con (npm install multer)(para guardar archivos)
const auth = require ('./../config/auth')

/*router.get ("/perfil", controladores.getListado)
    /*(req, res) => {
    res.sendFile(__dirname + '/public/perfil.html') // 1ero dirijo e pedido "/" al index
})
*/
/*(2º) CONFIGURO multer: el metodo diskStorage ejecuta multer en el objeto storage (crea internamente dos metodos particulares q configuran la carpeta donde se guardarán los archvivos 
 y con qué nombre se van a guardar...
 destination es el destino don de se van a guardar (la carpeta)
 y filename es el nombre con el cual se van a guradar los archivos*/


 //COMENTO PORQUE VOY A USAR MULTER no en diskStorage sin en memoryStorage:
 /*
const storage = multer.diskStorage({// multer.diskStorage
    destination: (req, file, cb) => {
        cb(null, `public/img/`)
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + "_" + file.originalname)
    }
})
*/
const upload = multer({ storage: multer.memoryStorage() });
/*
const uploadFile = multer({ storage: multer.memoryStorage() })
*/
//(3ª)LEVANTO LA CONFIGURACION... Guardo en la variable uploadFile la configuracion de multer
//falta ahora decir de qué manera ejecuto multer ,,, en cual de las rutas debe entrometerse al recibir el archivo (ENtre cual de las rutas de Routes interviniendo el post (el override))

const isLogged = (req, res, next)=> {//si no hay req userId, redireccioname a login, si hay sesion activa...next (ir a modificar)
    if (!req.session.userId){
        return res.redirect('/login.html')
    }
    next()
}



router.get ('/proy/:nombre', /*auth,*/controladores.getListado) 
//(4º)EJECUCION DE MULTER. entre la definicion de la ruta y la llamada al controlador. Defino el tipo de envio va a recibir (single es un solo archivo por ves) y le digo el nombre del campo 
//(el name del imput en el formulario)

const rules = [
    body("nombre")
        .escape()
        .notEmpty()
        .withMessage("El nombre es requerido"),

    body('precio')
        .escape()
        .notEmpty()
        .withMessage("El precio es requerida")
        .bail()
        .isNumeric()
        .withMessage("El precio debe ser solo numeros"),
    body('img').custom((value, { req })=> {
        if (!req.file) {
            throw new Error("Requerida");
        }

        if (!req.file.mimetype.startsWith("image/")) {
            throw new Error("Type image/*");
        }

        if (!req.file.size  > 1 * 1024 * 1024) { //1 (mb)  * 1024  * 1024
            throw new Error("Maximo 1Mb");
        }
    
        return true; //si está todo ok envia un TRUE
    }),

];

router.post (`/proy/:nombre`,  upload.single('img'), rules, controladores.crearRegistro) // uploadFile.single('img')
//y la llamada al controlador
//    router.post (`/proy/:nombre`, controladores.crearRegistro)
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
router.delete ('/proy/:nombre', isLogged, controladores.eliminar)

router.get ('/modificar/:id',  isLogged, controladores.getModificar)/*estaba comentado: isLogged*/

router.put ('/modificar', isLogged, controladores.actualizar)//le agrego el midelware (que estté logueado) para usar express sessions

router.get('/proys', controladores.getProys)//NEW

router.get('/detalleProducto/:id', controladores.getDetalleProducto )//NUEVO

//router.post('/tip',/* body("name").notEmpty(), */controladores.store)


module.exports = router
