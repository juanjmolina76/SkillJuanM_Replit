const orderService = require('../services/orderService');
//const mpService = require('../services/mpService');

async function /*confirmOrder*/orderConfirmation(req, res) {
  try {
    const userId = req.session.userId;
/*
    const { orderId, mpItems } =
      await orderService.createOrderFromCart(userId);
//
console.log(("Orden creada: ", orderId, "Total:", total, "Items:", mpItems));

res.render('order-confirmation');
//

    const preference =
      await mpService.createPreference(orderId, mpItems);

    await orderService.savePreferenceId(orderId, preference.id);

    res.redirect(preference.init_point);
*/
await orderService.createOrderFromCart(userId);

res.send('order-confirmation');



  } catch (error) {
    console.error(error);
    res.status(500).send("Error procesando orden");
  }
}

module.exports = {
  //confirmOrder,
  orderConfirmation
};

