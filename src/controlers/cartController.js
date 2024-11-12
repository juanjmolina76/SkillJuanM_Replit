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
        console.log("Product ID:", productId ); //verificar qu el ID del producto se recibe crrectamene
        console.log("Quantity: ", quantity); //verificar la cantidad


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
    }
    console.log("Current cart:", req.session.cart); //verificar el contenido del carrito
        req.session.cart = cart;
 
    //res.redirect('/cart');
    res.render('cart', { cart });
},

showCart: async (req, res) => {
        const cart = req.session.cart || [];
        console.log(cart);

        const detailedCart = await Promise.all(
            cart.map(async item => {
                const productInfo = await getProductById(item,productId);
                return {
                    productId: item.productId,
                    name: productInfo.nombre,
                    price: productInfo.precio,
                    quantity: item.quantity
                    /*
                    name: productInfo.nombre,
                    price: productInfo.precio,*/
                };        
            })
);
    res.render('cart', { cart:detailedCart });

    //res.render('cart', { cart });
},
// Función para confirmar compra y guardar en la base de datos
checkout: async (req, res) => {
    const cart = req.session.cart;

if (!cart || cart.length === 0) {
    return res.redirect('/cart');
}
try {
    await conn.saveOrder ({ //database
        userId: read.session.userId,
        items: cart,
        date: new Date(),
    });
    req.session.cart = []; // Limpiar el carrito después de la compra
    res.redirect ('/order-confirmation');

} catch (error) {
    console.error('Error al guardar el pedido: ', error);
    res.status(500).send('Hubo un error al procesar tu pedido');
}


},
// Función para actualizar cantidad de producto en el carrito
updateCart: async (req,res) => {
    const { productId } =req.params;
    const quantity = parseInt(req.body.quantity);

    if (req.session.cart){
        const cart = req.session.cart;
        const product = cart.find(item => item.preductId === productId);
        if (product) {
            product.quantity = quantity;
        }
    }
    res.redirect('/cart');
},
// Función para eliminar producto del carrito
removeFromCart: async (req,res) =>{
    const { productId }= req.params;

    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(item => item.productId !== productId);
    }
    res.redirect('/cart');
}

}