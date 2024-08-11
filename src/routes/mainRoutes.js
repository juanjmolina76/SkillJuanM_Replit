const express = require('express')
const router = express.Router()
const controladores = require('../controlers/mainController')
//const path = require('path')

/*router.get ("/perfil", controladores.getListado)
    /*(req, res) => {
    res.sendFile(__dirname + '/public/perfil.html') // 1ero dirijo e pedido "/" al index
})
*/

router.get ('/proy/:nombre', controladores.getListado) 

router.post (`/proy/:nombre`, controladores.crearRegistro)
    /*(req, res)=> {
    //console.log(req.body.create)
    //console.log(req.body)
    res.send(`<h2>Se hizo algo con ${req.body.create} en el create</h2><a href="/Proy/Digitales">Volver a la pagina anterior</a>`)
    //res.json(req.body.create)
})*/

router.put ('/proy', (req, res)=> { 
     res.send(`<h2>Se hizo algo con ${req.body.actualizar} en el update</h2><a href="/Proy/Digitales">Volver a la pagina anterior</a>`)//podria usar PATCH
})

router.delete ('/proy/:nombre', controladores.eliminar)

router.get ('/modificar/:id', controladores.getModificar)

router.put ('/modificar', controladores.actualizar)

module.exports = router
