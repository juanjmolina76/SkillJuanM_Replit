const { conn } = require('../db/dbconnect')
const { validationResult } = require("express-validator");
const path = require("path");
const sharp = require("sharp");

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
            const result = validationResult(req)
            console.log(result)

            if(!result.isEmpty()) {
                return res.status(422).json({ errors: result.array() });

            }    
                

            if (req.file){
              sharp (req.file.buffer) 
              .resize(640)
              .toFile(
                path.resolve(__dirname , "../../public/img", req.file.originalname))  
                .then(()=> {
                    console.log('Imagen guardada correctamente');
                })
                .catch((error)=> {
                    console.log('Error al guardar la imagen', error);
                })
            };
            console.log(req.file);
           // res.status(201).json(req.body);

            const sql = `INSERT INTO producto (nombre, descripcion, precio, img, id_tipo) VALUES (?,?,?,?,?);`
            const creado = await conn.query(sql, [req.body.nombre, req.body.descripcion, parseFloat(req.body.precio), req.file.originalname, req.body.id_tipo, ]) //req.file.filename ó req.file.originalname
            console.log(creado)
            console.log(req.file.originalname)
           
            res.redirect('/proyectosDigitales.html')
        }catch (error){
            throw error
        }finally{
            conn.releaseConnection()
        }  
    },

    eliminar: async (req, res)=>{
        console.log(req.body.idEliminar);
        const eliminado = await conn.query(`DELETE FROM producto WHERE id=?`, req.body.idEliminar)//borra el value del campo llamado idEliminar (que está escondido hidden)
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
    //getDetalleProducto: async (req, res) => {
        //  getDetalleProducto: async function handleRequest(req, res) {
            getDetalleProducto: async (req, res) => {
        try{
            const idProd = req.params.id
            console.log(req.params.id)
            console.log(req.params.idProd)
            const [registro] = await conn.query(`SELECT p.*, t.id AS tipo
                                                FROM producto p
                                                JOIN tipo t ON p.id_tipo = t.id
                                                WHERE p.id = ${idProd};`);// ;SELECT * from tipo WHERE id = `)
            res.render('detalleProducto', { producto: registro[0]/*, tipo: registro[1]*/, tituloDePagina: 'Detalle de Proyecto'});
                //console.log(registro[1])
        }catch(error){
            throw error;
        } finally{
            conn.releaseConnection();
        }
        }


    }
/*
   const store = (req, res) => {
        const result = validationResult(req);
        console.log(result)
        res.status(201).json(req.body);
    };


    module.exports = {store,

    };

    */