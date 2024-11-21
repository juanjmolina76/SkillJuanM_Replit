const express = require('express')
const router = express.Router()
//const { body } = require ("express-validator");/*Agrego Express Validator*/ 

const cartController = require('../controlers/cartController');


const isLogged = (req, res, next)=> {//si no hay req session userId, redireccioname a login, si hay sesion activa...next (ir a modificar)
    if (!req.session.userId){
        return res.redirect('/login.html')
    }
    next()
}
//Rutas para el carrito de compras

router.get('/cart', isLogged, cartController.showCart);
router.post('/cart/add/:productId', isLogged, cartController.addToCart);
router.post('/update/:productId', isLogged,  cartController.updateCart);
router.post('/remove/:productId', isLogged, cartController.removeFromCart);
router.post('/checkout', isLogged, cartController.checkout);
router.get('/miCart', isLogged, cartController.getmiCart);
module.exports = router;