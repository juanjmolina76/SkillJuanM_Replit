const { conn } = require('../db/dbconnect')

module.exports = {


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

    crearRegistro: async (req, res)=> {
        console.log(req.file)
        try{
            const sql = `INSERT INTO producto (nombre, descripcion, precio, img, id_tipo) VALUES (?,?,?,?,?);`
            const creado = await conn.query(sql, [req.body.nombre, req.body.descripcion, parseFloat(req.body.precio), req.body.img, req.body.id_tipo])
            console.log(creado)
            res.redirect('/proyectosDigitales.html')
        }catch (error){
            throw error
        }finally{
            conn.releaseConnection()
        }  
    },

    eliminar: async (req, res)=>{
        console.log(req.body.idEliminar);
        const eliminado = await conn.query(`DELETE FROM producto WHERE id=?`, req.body.idEliminar)
        console.log(eliminado);
        res.redirect('/proyectosDigitales.html')
    },

    getModificar: async (req, res)=>{
        const  [ modificar ] = await conn.query(`SELECT * FROM producto WHERE id=?`, req.params.id)
        console.log(modificar);
        
        //console.log('Registro:', registro);
        res.render('modificar', {
            tituloDePagina: 'Modificar datos de registros',
            registro: modificar[0]
        })

    },
    actualizar: async (req, res)=> {
        console.log(req.body)
        //res.send(`<h2>se hizo algo con ${req.body.actualizar} en el update`)
        const sql = `UPDATE producto SET nombre=?, descripcion=?, precio=?, img=? WHERE id=?;`
        const {idMod, nombre, descripcion, precio, img, id_tipo} = req.body
        const modificado = await conn.query(sql, [nombre, descripcion, precio, img, idMod])
        console.log(modificado)
        res.redirect('/proyectosDigitales.html') 
    }
}

