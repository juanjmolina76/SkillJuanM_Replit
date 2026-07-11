const orderService = require('../services/orderService');
const mpService = require('../services/mpService');

async function confirmOrder(req, res) {
  try {
    const userId = req.session.userId;

// 1️⃣ crear orden
    const { orderId, mpItems, total} =
      await orderService.createOrderFromCart(userId);
//
console.log(("Orden creada: ", orderId, "Total:", total, "Items:", mpItems));//COMENTAR LUEGO

console.log("Orden creada:", orderId);
console.log("Items MP:", mpItems);
console.log("Total:", Number(total));

//res.render('order-confirmation');
//
// 2️⃣ crear preferencia
    const preference =
      await mpService.createPreference(orderId, mpItems);

// 3️⃣ guardar preference id
    await orderService.savePreferenceId(orderId, preference.id);

     // 4️⃣ redirigir a MP
  return res.redirect(preference.init_point);


/*
await orderService.createOrderFromCart(userId);

res.send('order-confirmation');

*/

  } catch (error) {
    console.error(error);
    res.status(500).send("Error procesando orden");
  }
}

module.exports = {
  confirmOrder
  
};

