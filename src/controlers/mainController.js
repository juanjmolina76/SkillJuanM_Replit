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
            const creado = await conn.query(sql, [req.body.nombre, req.body.descripcion, parseFloat(req.body.precio), req.file.filename, req.body.id_tipo, ]) //req.file.filename
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
        console.log(req.session.userId)
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
    },

    //NEW
    getProys: async (req, res) => {
        try{
            const [ registros] = await conn.query(`SELECT * FROM producto`)
            //res.json(registros)
            
            
            res.render('proys',{
                productos: registros,
                tituloDePagina: 'Cards de Proyectos',
                
                
            })
           console.log(registros)
        } catch (error){
            throw error
        } finally {
            conn.releaseConnection()

        }
       //NEW
    },

    //NUEVO
    getDetalleProducto: async (req, res) => {
        try{
            const idProd = req.params.id
            console.log(req.params.id)
            const [registro] = await conn.query(`SELECT p.*, t.id AS tipo
                                                FROM producto p
                                                JOIN tipo t ON p.id_tipo = t.id
                                                WHERE p.id = ${idProd}`);
            res.render('detalleProducto', { producto: registro[0], tituloDePagina: 'Detalle de Proyecto'});
        }catch(error){
            throw error;
        } finally{
            conn.releaseConnection();
        }
        }
    }