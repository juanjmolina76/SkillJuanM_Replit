const express = require(`express`)
const app = express()

const port = 8080 || process.env.PORT || 3000

app.use(express.static(__dirname + '/public')); //2do indico dónde buscará css, js,etc de los archivos estaticos
//igualmente al llamarse index al ser static public, busca el primer archivo estatico index
app.get ("/perfil", (req, res) => {
    res.sendFile (__dirname + '/public/perfil.html') // 1ero dirijo e pedido "/" al index

})

app.get ("/listado", (req, res) => {
    res.sendFile (__dirname + '/src/view/proyectos.html') // 1ero dirijo e pedido "/ al index
})





app.listen (port, () => console.log(`Estoy arriba en el puerto ${port}`))

