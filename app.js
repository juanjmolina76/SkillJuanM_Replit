const express = require(`express`)
const override = require('method-override')
const app = express()


const port = 8080 || process.env.PORT || 3000

app.use(express.static(__dirname + '/public')); //2do indico dónde buscará css, js,etc de los archivos estaticos
//igualmente al llamarse index al ser static public, busca el primer archivo estatico index
app.use(express.urlencoded({extended: true}))
app.use(override('_metodo'))

app.get ("/perfil", (req, res) => {
    res.sendFile (__dirname + '/public/perfil.html') // 1ero dirijo e pedido "/" al index

})

app.get ("/proy/:nombre", (req, res) => {
    //console.log(req.params.nombre)
    res.sendFile (__dirname + `/src/view/proyectos${req.params.nombre}.html`)//RUTA DINAMICA PARAMETRIZADA
})

app.post ('/proy', (req, res)=> {
    console.log(req.body.create)
    console.log(req.body)
    res.send(`<h2>Se hizo algo con ${req.body.create} en el create</h2><a href="/Proy/Digitales">Volver a la pagina anterior</a>`)
    res.json(req.body.create)
})

app.put ('/proy', (req, res)=> {
     res.send(`<h2>Se hizo algo con ${req.body.actualizar} en el update</h2><a href="/Proy/Digitales">Volver a la pagina anterior</a>`)//podria usar PATCH
})

app.delete ('/proy', (req, res)=> {
    res.send(`<h2>Se hizo algo con ${req.body.eliminar} en el delete</h2><a href="/Proy/Digitales">Volver a la pagina anterior</a>`)
})



app.listen (port, () => console.log(`Estoy arriba en el puerto ${port}`))

