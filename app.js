const express = require(`express`)
const override = require('method-override')
const rutas = require('./src/routes/mainRoutes.js')
const app = express()
//const path = require('path')


const port = 8080 || process.env.PORT || 3000

//para utilizar motor de vistas ejs
app.set('view engine', 'ejs')
app.set('views', (__dirname + '/src/views'))

app.use(override('_metodo'))
app.use(express.static(__dirname + '/public')); //2do indico dónde buscará css, js,etc de los archivos estaticos
//igualmente al llamarse index al ser static public, busca el primer archivo estatico index
app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use('/', rutas)
//siempre despues de las rutas por manenjo de errores:

//app.get('/algo',( req, res) =>res.send("hola"))

app.use((req, res, next) => {
    res.status(404).send(`<h1 style="color:red">Recurso no encontrado!</h1>`)
})

app.listen (port, () => console.log(`Estoy arriba en el puerto ${port}`))

