const { CONNREFUSED } = require('dns');
const { conn } = require('../db/dbconnect')
//const { validationResult } = require("express-validator");
//const path = require("path");
const { Console } = require('console');


module.exports = {


//CARRITO:




// no va esto:
getProductById : async (productId) => {
    try {
        const [rows] = await conn.promise().query('SELECT * FROM producto WHERE id = ?', [productId]);
        return rows[0]; // Devuelve el primer resultado si existe
    } catch (error) {
        console.error("Error al obtener producto:", error);
        throw error;
    }
},
//

addToCart: async (req, res) => {
        
    const productId  = parseInt(req.params.productId, 10);
    const quantity = parseInt(req.body.quantity, 10) || 1;
    const precio = parseFloat(req.body.precio)
        console.log("Product ID:", productId ); //verificar qu el ID del producto se recibe crrectamene
        console.log("Quantity: ", quantity); //verificar la cantidad
        console.log("Precio: ", precio);

    if (!req.session.cart) { 
        req.session.cart = [];
    }

    const cart = req.session.cart;

    const productIndex = cart.findIndex(item => item.productId === productId);

    if (productIndex !== -1) {
        cart[productIndex].quantity += quantity;
        console.log("Actualizado para producto existente", cart[productIndex]);

    } else {
        cart.push({ productId, quantity });
        
        console.log("Added new product to cart:", {productId, quantity});
        console.log("Datos del cart: ",cart);
        console.log("ProductIndex: ",productIndex);
    }
    console.log("Current cart:", req.session.cart); //verificar el contenido del carrito
        //req.session.cart = cart;
 
    //res.redirect('/cart');
    res.render('cart', { cart });
},

showCart: async (req, res) => {
        const cart = req.session.cart || [];
        console.log(cart);
        console.log("usuarioSession: ",req.session.userId)
       /* const detailedCart = await Promise.all(
            cart.map(async (item) => {
                const productInfo = await getProductById(item,productId);
                return {
                    productId: item.productId,
                    name: productInfo.nombre,
                    price: productInfo.precio,
                    quantity: item.quantity
                    /*
                    name: productInfo.nombre,
                    price: productInfo.precio,
                };        
            })
);*/
        // Mapea los detalles del carrito (directamente desde la sesión)
        const detailedCart = cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));
    res.render('cart', { cart:detailedCart });

    //res.render('cart', { cart });
},



// Función para confirmar compra y guardar en la base de datos
checkOUt: async (req, res) => {
    const cart = req.session.cart;

if (!cart || cart.length === 0) {
    return res.redirect('/cart');
}
try {
    await conn.getConnection( async (connection) => { 
        await connection.beginTransaction();

                     // Guardar la orden principal en `orders`
                     const [result] = await conn.query(
                        'INSERT INTO orders (userId, date) VALUES (?, ?)',
                        [req.session.userId, new Date()]
                    );
                    const orderId = result.insertId;// obtengo el ID de la orden recien creada
                    console.log(orderId);



                    
                    // Guardar cada producto en `order_items`
                const orderItemsPromises = cart.map(item => {
                    return connection.query(
                        'INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ? )',
                        [orderId, item.productId, item.quantity, item.price]
                    );
                });
                await Promise.all(orderItemsPromises);
                await connection.commit();
            });

            //req.session.cart = []; // Limpiar el carrito después de la compra
            res.redirect('/order-confirmation');

} catch (error) {
    console.error('Error al guardar el pedido: ', error);
    res.status(500).send('Hubo un error al procesar tu pedido');
}
},



// OTRA version de chceckout

checkout: async (req, res) => {
    const cart = req.session.cart;

    if (!cart || cart.length === 0) {
        return res.redirect('/cart');
    }

    try {
        // Crear la orden en la tabla `cart`
        const [sqlOrder] = await conn.query(
            `INSERT INTO cart (user_id, date, status) VALUES (?, ?, ?)`,
            [req.session.userId, new Date(), 'active']
        );

        const orderId = sqlOrder.insertId; // Obtén el ID de la orden recién creada
        console.log("Order ID:", orderId);

        // Obtener precios de los productos
        const pricesPromises = cart.map(item => {
            return conn.query('SELECT precio FROM producto WHERE id = ?', [item.productId])

                .then(([rows]) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: rows[0]?.precio || 0 // Usar precio 0 si no se encuentra el producto
                }));
        });

        // Esperar a que se resuelvan todas las promesas
        const itemsWithPrices = await Promise.all(pricesPromises);
        console.log("Items con precios:", itemsWithPrices);

        // Insertar productos en `cart_items`
        const orderItemsPromises = itemsWithPrices.map(item => {
            return conn.query(
                'INSERT INTO cart_items (cart_id, product_id, quantity, price, added_at) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.productId, item.quantity, item.price, new Date()]
            );
        });

        await Promise.all(orderItemsPromises);

        // Limpiar el carrito después de la compra
        req.session.cart = [];
        res.redirect('/order-confirmation');
    } catch (error) {
        console.error("Error en checkout:", error);
        res.status(500).send("Hubo un error al procesar tu pedido.");
    } finally {
        conn.releaseConnection();
    }
},



// Función para actualizar cantidad de producto en el carrito
updateCart: async (req,res) => {
    const { productId } =req.params;
    const quantity = parseInt(req.body.quantity);

    if (req.session.cart){
        const cart = req.session.cart;
        const product = cart.find(item => item.preductId === productId);
        
        if (product) {//Actualizo la cantidad
            product.quantity = quantity;
            console.log(`la cantidad del prod con ID ${productId} actualizada a ${quantity}`);
        } else {
            console.log(`producto con ID ${productId} no encontrado en el carrito`);
        }
     } else {
            console.log(`no hay carrito en la session`);
        }
    
    //res.render('/cart')
    //res.redirect('/cart', { cart });
    res.redirect('/cart');
},
// Función para eliminar producto del carrito
removeFromCart: async (req,res) =>{
    const cart = req.session.cart || [];
    const { productId } = req.params;
    //const [eliminado ] = req.params;
    //const cart = req.session.cart;
    if (req.session.cart) {//filtra los productos para eliminar el indicado
        req.session.cart = req.session.cart.filter(item => item.productId !== productId);
        console.log(`Producto con ID ${productId} eliminado del carrito.`)
        
        }   else {
        console.log("No hay carrito en la sesion.")
    }
   
//res.render('cart', { cart:detailedCart }); //'cart'
//show cart ????
    //res.render('cart', { cart });
    res.redirect('/cart');
},



getMiCart: async (req, res) => {
    try{
    console.log(req.session.userId)
    const [ miCart ] = await conn.query('SELECT * FROM cart_items WHERE user_id = ?]',[req.session.userId])
    res.json(retistros)
    }catch (error){
    throw error
    }finally {
        conn.releaseConnection()
    }
},
//otra version de getmiCart
getmiCart: async (req, res) => {
    try{
    const  [[cartRow]]  = await conn.query (
        'SELECT max(id) as cartId FROM cart WHERE user_id =?',[req.session.userId])
        
     
        const cartId = cartRow.cartId; //Extraigo el `cartId` directamente
        console.log('último cartId:', cartId)

        if (!cartId) {
            return res.status(404).send('No hay carritos para este usuario');
        }

        const  [registros ] = await conn.query('SELECT * FROM cart_items WHERE cart_id=?',[cartId]);

        console.log('Registros del carrito:', registros);

            totalGeneral = 0;
            registros.forEach(item =>{
                item.totalPorItem = (item.price * item.quantity);
                totalGeneral += item.totalPorItem;
                
            }) 

        console.log('Total General carrito: ',totalGeneral);

        res.render('itsMiCart', { registros, totalGeneral }); // renderizo la vista itsMiCart con los registros

     }  catch (error) {
        console.log('Error obteniendo datos del carrito:',error)
        res.status(500).send('Hubo un error obteniendo los datos del carrito...')
     }     
},
orderConfirmation: (req, res) => {
    res.render('order-confirmation');
}

}




