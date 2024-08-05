const { conn } = require('../db/dbconnect')

module.exports = {

/*
getListado: async (req, res) => {
    res.sendFile(__dirname + '/public/perfil.html') // 1ero dirijo e pedido "/" al index

}*/





    getListado: async (req, res) => {
        try{
            const [ registros] = await conn.query(`SELECT * FROM producto`)
            res.json(registros)
        } catch (error){
            throw error
        } finally {
            conn.releaseConnection()
        }
    },

   /* crearRegistro: async (req, res)=>{
            console.log(req.file)
    },*/

    crearRegistro: async (req, res)=> {
        //console.log(req.body.create)
        //console.log(req.body)
       // res.json({mensaje: 'esto es un json simple'})
        //res.json(req.body.create)
        try{
            const sql = `INSERT INTO producto (nombre, descripcion, precio, img, id_tipo) VALUES (?,?,?,?,?);`
            const creado = await conn.query(sql, [req.body.nombre, req.body.descripcion, parseFloat(req.body.precio), req.body.img, req.body.id_tipo])
            //console.log(creado)
        }catch (error){
            throw error
        }finally{
            conn.releaseConnection()
        }  
        },
    }


