const { conn } = require('../db/dbconnect')
const { validationResult } = require("express-validator");
const path = require("path");
const sharp = require("sharp");
const cloudinary = require("../config/cloudinary");
const { url } = require('inspector');

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


  // 1. Procesar con sharp la imagen (resize)                               NUEVO CON CLOUDINARY
                const imagenProcesada = await sharp(req.file.buffer)
                    .resize(640)
                    .jpeg({ quality: 80 })
                    .toBuffer()
/*
                    .then((data) =>  Stream.end(data))
                    .catch((err) => reject(err));

*/

/*  // 1. Guardar en carpeta local (public/img)                             ANTES DE HABER CAMBIADO A CLOUDINARY
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
*/


// 2. Subir a Cloudinary con upload_stream                           NUEVO CON CLOUDINARY   
                const cloudinaryUpload = async (buffer) => {
                    return new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream(
                            {   folder: "productos",
                                resource_type: "image",
                                use_filename: true,
                                unique_filename: true,
                                public_id: path.parse(req.file.originalname).name.replace(/\s+/g, '_'), // nombre sin extensión y sin espacios .name.replace(/\s+/g, '_
                            }, // carpeta dentro del cloud
                            (err, result) => {
                                if (err) reject(err);
                                else resolve(result);
                            }
                        ).end(buffer);
                    });
                };

                const uploadResult = await cloudinaryUpload(imagenProcesada);

                urlImagen = uploadResult.secure_url;
                publicId = uploadResult.public_id;


                console.log("Imagen subida a Cloudinary:");
                console.log(uploadResult.secure_url);
                console.log("Public ID:", publicId);


            }
            //Guardar en la base de datos el URL de la imagen en Cloudinary         NUEVO CAMBIO CON CLOUDINARY

            const sql = `INSERT INTO producto (nombre, descripcion, precio, img, id_tipo, public_id) VALUES (?,?,?,?,?,?);`
            const creado = await conn.query(sql, [req.body.nombre, req.body.descripcion, parseFloat(req.body.precio), urlImagen, req.body.id_tipo, publicId,]) //req.file.filename ó [EN LUGAR DE urlImagen: req.file.originalname]
            //para que guarde el nombre del archivo en la bd y no en local              NUEVO CAMBIO CON CLOUDINARY
            console.log(creado)
            //console.log(req.file.originalname)
            //en proyectosDigitales.html (con maincontroller.js) hago el llamado a getListado para mostrar los productos pero con el url y no la ruta local-         NUEVO CAMBIO CON CLOUDINARY
    
            res.redirect('/proyectosDigitales.html')
        }catch (error){
            throw error
        }finally{
            conn.releaseConnection()
        }  
    },
/*
    eliminar: async (req, res)=>{
        console.log(req.body.idEliminar);
        const eliminado = await conn.query(`DELETE FROM producto WHERE id=?`, req.body.idEliminar)//borra el value del campo llamado idEliminar (que está escondido hidden)
        console.log(eliminado);
        
        res.redirect('/proyectosDigitales.html')

        cloudinary.uploader.destroy(`productos/${req.body.idEliminar}`, function(error, result) {               //elimina la imagen de cloudinary
        console.log(result, error);
        });
    },
*/

eliminar: async (req, res)=>{
        const { idEliminar } = req.body;
        console.log(idEliminar);
        try {
// 1 - buscar el producto para obtener el public_id de cloudinary
        const [rows] = await conn.query(
        'SELECT public_id FROM producto WHERE id = ?', [idEliminar]
        );

        if (rows.length === 0 ) {
        return res.status(404).send('Producto no encontrado');

        }

        const publicId = rows[0].public_id;
//2 - eliminar imagen en cloudinary (si existe public_id)
        if (publicId) {
        await cloudinary.uploader.destroy(publicId, {
        invalidate: true
        });
        console.log('Imagen eliminada de Cloudinary:', publicId);
        };

//3 - Eliminar el registro de la base de datos
        await conn.query(
        'DELETE FROM producto WHERE id=?', 
        [idEliminar]
        );
//4 - Redirigir a la pagina proyectos Digitales

        res.redirect('/proyectosDigitales.html');
        }
//5 - manejar errores
        catch (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).send('Error al eliminar producto');
        }
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
            const [ registros] = await conn.query(`SELECT p.*, s.CantEXistente AS Stock
                                                FROM producto p JOIN stock s ON p.id = s.id_prod;`)
  // //SELECT * FROM producto
            //res.json(registros)
            //const [ ProdStock ] = await conn.query('SELECT p.*, s.CantEXistente AS Stock
   //                                             FROM producto p
  //                                              JOIN stock s ON p.id = s.id_prod
  //                                              WHERE p.id = ${idProd};')
            //hacer un inner join entre producto y stock 
            res.render('proys',{
                productos: registros,
                tituloDePagina: 'Cards de Proyectos',
                
                
            })
           //console.log(registros)
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

 //         // CONSULTA query con JOIN:

 //     getDetalleProducto: async (req, res) => {
 //       try{
 //           const idProd = req.params.id
 //           console.log(req.params.id)
  //          console.log(req.params.idProd)
  //          const [registro] = await conn.query(`SELECT p.*, t.id AS tipo
   //                                             FROM producto p
  //                                              JOIN tipo t ON p.id_tipo = t.id
  //                                              WHERE p.id = ${idProd};`);
  //          res.render('detalleProducto', { producto: registro[0], tituloDePagina: 'Detalle de Proyecto'});
   //             //console.log(registro[0])
  //      }catch(error){
   //         throw error;
   //     } finally{
   //         conn.releaseConnection();
 //       }
 //   },



        getDetalleProducto: async (req, res) => {
            try{
                const idProd = req.params.id
            const [resProd] =await conn.query(`SELECT  * FROM producto  WHERE  id = ${idProd};`)

            const [resTipo] =await conn.query(`SELECT * FROM tipo WHERE id= ?`,[resProd[0]?.id_tipo])

            res.render('detalleProducto', { producto: resProd[0], tipo: resTipo[0], tituloDePagina: 'Detalle de Proyectos'});

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