const express = require(`express`)

const port = 8080 || process.env.PORT || 3000
 
app.get ("/", (req, res) => {
    app.sendFile (__dirname + '/proyectos.html')

})

app.listen (port, () => console.log('Estoy arriba en el puerto ${port}'))

