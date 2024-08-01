const express = require('express')
const router = express.Router()
const path = require('path')

router.get ("/perfil", (req, res) => {
    res.sendFile(__dirname + '/public/perfil.html') // 1ero dirijo e pedido "/" al index

})

router.get ("/proy/:nombre", (req, res) => {
    //console.log(req.params.nombre)
    res.sendFile(path.resolve(__dirname + `./../view/proyectos${req.params.nombre}.html`))//RUTA DINAMICA PARAMETRIZADA
})

router.post ('/proy', (req, res)=> {
    //console.log(req.body.create)
    //console.log(req.body)
    res.send(`<h2>Se hizo algo con ${req.body.create} en el create</h2><a href="/Proy/Digitales">Volver a la pagina anterior</a>`)
    //res.json(req.body.create)
})

router.put ('/proy', (req, res)=> {
     res.send(`<h2>Se hizo algo con ${req.body.actualizar} en el update</h2><a href="/Proy/Digitales">Volver a la pagina anterior</a>`)//podria usar PATCH
})

router.delete ('/proy', (req, res)=> {
    res.send(`<h2>Se hizo algo con ${req.body.eliminar} en el delete</h2><a href="/Proy/Digitales">Volver a la pagina anterior</a>`)
})

module.exports = router
