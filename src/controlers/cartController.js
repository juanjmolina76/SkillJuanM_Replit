const { CONNREFUSED } = require('dns');
const { conn } = require('../db/dbconnect')
//const { validationResult } = require("express-validator");
const path = require("path");
const { Console } = require('console');


module.exports = {


//CARRITO:


addToCart: async (req, res) => {
    const { productId } = req.params;
    const quantity = parseInt(req.body.quantity) || 1;
        console.log("Product ID:", productId ); //verificar qu el ID del producto se recibe crrectamente
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
    }
    console.log("Current cart:", req.session.cart); //verificar el contenido del carrito

    res.redirect('/cart');
},

showCart: async (req, res) => {
        const cart = req.session.cart || [];
        const detailedCart = await Promise.all(
            cart.map(async item => {
                const productInfo = await getProductById(item,preductId);
                return {
                    name: productInfo.name,
                    price: productInfo.price,
                };
            
            })
);

    res.render('cart', { cart:detailedCart });
},
// Función para confirmar compra y guardar en la base de datos
checkout: async (req, res) => {
    const cart = req.session.cart;

if (!cart || cart.length === 0) {
    return res.redirect('/cart');
}

try {
    await database.saveOrder ({
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