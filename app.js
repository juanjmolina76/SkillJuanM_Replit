const express = require(`express`)
const override = require('method-override')
const rutas = require('./src/routes/mainRoutes.js')
const login = require ('./src/routes/loginRoutes.js')
const cartRoutes =require ('./src/routes/cartRoutes')
const app = express()//levanto express sessions
const auth = require('./src/config/auth')//verificar que el usuario tenga AUTORIZACION para entrar a todas las rutas de mi RAMA
const session = require('express-session')
//const bodyParser = require ('body-parser')

const path = require('path')


const port =  process.env.PORT || 3000 //8080 ||

//para utilizar motor de vistas ejs
app.set('view engine', 'ejs')
app.set('views', (__dirname + '/src/views'))


app.use(express.static(__dirname + '/public')); //2do indico dónde buscará css, js,etc de los archivos estaticos
//igualmente al llamarse index al ser static public, busca el primer archivo estatico index
app.use(express.urlencoded({extended: true}))
//para sobreescribir el metodo POST que escucha en el puerto 
app.use(override('_metodo'))
app.use(express.json());


app.use(session({//inicializo express sessions y lo configuro
    secret: "S3cr3t_H@sh01",
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: false }
    

})) 


app.use('/login', login)//login/login  o /login/registro todo lo que venga con / login lo va a buscar 
//al archivo loginRoutes
//app.use('/admin', rutasAdmin) // /admin/loquesea /admin/xyz
app.use('/',  rutas)//('/', auth, rutas) //AUTORIZACION PARA todas LAs RAMAs  // en vez de autenticar una sola ruta en mainRoutes.js //

app.use('/', cartRoutes)
//app.use("/tip", require('./src/routes/mainRoutes.js'))

//app.use('/', auth, rutasAuth)//para que requira el token          //
//app.use('/admin', rutasAdmin)
//app.use('/admin', auth, rutasAdmin )

//app.get('/algo',( req, res) =>res.send("hola"))

//siempre despues de las rutas por manenjo de errores:
//manejo de errores
app.use((req, res, next) => {
    res.status(404).send(`<h1 style="color:red">Recurso no encontrado!</h1>`)
})



//escucha lo que el puerto tiene y lo publica en consola
app.listen (port, () => console.log(`Estoy arriba en el puerto ${port}`))

