const { CONNREFUSED } = require('dns');
const { conn } = require('../db/dbconnect')
//const { validationResult } = require("express-validator");
//const path = require("path");
const { Console } = require('console');


module.exports = {

//CARRITO:

/*
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
*/
AddToCart: async (req, res) => {
        
    const productId  = parseInt(req.params.productId, 10);
    const quantity = parseInt(req.body.quantity, 10) || 1;
    const nombre = req.params.nombre;
    //const precio = parseFloat(req.body.precio)
        console.log("Product ID:", productId ); //verificar qu el ID del producto se recibe crrectamene
        console.log("Quantity: ", quantity); //verificar la cantidad
        console.log("nombre", nombre); // NO LA OBTENGO PORQUE en el post vino solo el product id, ..deberia hacer otra query para saber el nombre
        //console.log("Precio: ", precio);

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

// ******       AGREGADO DESDE ACÁ
        const pricesPromises = await cart.map(item =>  {
            const resultado =  conn.query('SELECT precio FROM producto WHERE id = ?', [item.productId])
            return resultado
            .then(([rows]) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: rows[0]?.precio || 0 // Usar precio 0 si no se encuentra el producto
            }));
        });
        // Esperar a que se resuelvan todas las promesas
        const itemsWithPrices = await Promise.all(pricesPromises);
        console.log("Items con precios:", itemsWithPrices);
// ******       AGREGADO HASTA ACÁ

    //res.redirect('/cart');
    res.render('cart', { cart });
},

/*
addToCart: async (req, res) => {
    const productId = parseInt(req.params.productId, 10);
    const quantity = parseInt(req.body.quantity, 10) || 1;

    if (!req.session.cart) { 
        req.session.cart = [];
    }

    const cart = req.session.cart;

    const productIndex = cart.findIndex(item => item.productId === productId);

    if (productIndex !== -1) {
        cart[productIndex].quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }

    // Obtener los precios y nombres de los productos en el carrito
    const pricesPromises = cart.map(async (item) => {
        const [rows] = await conn.query('SELECT nombre, precio FROM producto WHERE id = ?', [item.productId]);
        return {
            productId: item.productId,
            nombre: rows[0]?.nombre || 'Desconocido',
            quantity: item.quantity,
            price: rows[0]?.precio || 0
        };
    });

    const itemsWithPrices = await Promise.all(pricesPromises);

    // Calcular el total
    const totalGeneral = itemsWithPrices.reduce((total, item) => total + item.price * item.quantity, 0);
    console.log(cart)
    res.render('cart', { cart: itemsWithPrices, totalGeneral });
},
*/

addToCart : async (req, res) => {
    const productId = parseInt(req.params.productId, 10);
    //const quantity = parseInt(req.body.quantity, 10) || 1;
        console.log("Product ID:", productId ); //verificar qu el ID del producto se recibe crrectamene
       // console.log("Quantity: ", quantity); //verificar la cantidad
    if (!req.session.cart) {
        req.session.cart = [];
    }
    
    const cart = req.session.cart;
    const productIndex = cart.findIndex(item => item.productId === productId);

    if (productIndex !== -1) {
       // cart[productIndex].quantity = 1;
        //cart[productIndex].quantity += quantity;
       // console.log("Actualizado para producto existente", cart[productIndex]);
    } else {
        // Obtener información del producto desde la base de datos
        try {
            const [rows] = await conn.query('SELECT nombre, precio FROM producto WHERE id = ?', [productId]);
            if (rows.length > 0) {
                const product = rows[0];
                cart.push({
                    productId,
                    nombre: product.nombre,
                    precio: product.precio//,
                    //quantity
                });
            }
        } catch (error) {
            console.error("Error al obtener el producto:", error);
        }
    }

    req.session.cart = cart;
    res.render('cart', { cart });
},


showCart: async (req, res) => {
        const cart = req.session.cart || [];
        console.log(cart);
        console.log("usuario Session: ",req.session.userId)
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
checkout: async (req, res) => {
    const cart = req.session.cart;


    if (!cart || cart.length === 0) {
        return res.redirect('/cart');
    }
    else{
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
                    quantity: req.session.quantity,//: item.quantity, 
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
}
},

// Función para eliminar producto del carrito  ****** NO FUNCIONA  *******
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
    res.redirect('/cart');
},


getmiCart: async (req, res) => {
    try{
    const  [[cartRow]]  = await conn.query (
        'SELECT max(id) as cartId FROM cart WHERE user_id =?',[req.session.userId])
        
     
        const cartId = cartRow.cartId ; //Extraigo el `cartId` directamente ó (const cartId = cartRow.cartId -2)le resto 1 o 2 al ultimo para ver anteriores
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
orderConfirmation: async (req, res) => {

//const cart_id = req.body.cart_id;
const user_id = req.session.userId;
//console.log(cart_id);
try{
    const  [[cartRow]]  = await conn.query (
        'SELECT max(id) as cartId FROM cart WHERE user_id =?',[req.session.userId])
        
     
        const cartId = cartRow.cartId ; //Extraigo el `cartId` directamente ó (const cartId = cartRow.cartId -2)le resto 1 o 2 al ultimo para ver anteriores
        console.log('último cartId:', cartId)

        if (!cartId) {
            return res.status(404).send('No hay carritos para este usuario');
        }


    const [ sqlOrder ] = await conn.query(
        `INSERT INTO orders (user_id, cartItem_id, date) VALUES (?,?,?)`,
        [user_id, cartId, new Date() ]

        
    );
    console.log(sqlOrder)
} catch (error) {
    console.error("error al confirmar la orden definitiva:", error);
    res.status(500).send("Hubo un error al procesar la confirmacion de la orden.");
}finally {
    res.render('order-confirmation');
}



  //  res.render('order-confirmation');
}

}






