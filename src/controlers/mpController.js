const mpService = require('../services/mpService');
const orderService = require('../services/orderService');
/*
async function createCheckout(req, res) {
  try {
    const { orderId, items } = req.body;

    const response = await mpService.createPreference(orderId, items);

    await orderService.savePreferenceId(orderId, response.id);

    res.redirect(response.init_point);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error creando preferencia");
  }
}
*/
async function webhook(req, res) {
  try {
    console.log("Webhook recibido");
    console.log("Query:", req.query);
    console.log("Body:", req.body);

    // responder rápido
    res.sendStatus(200);

    // aceptar solo payments
    if (req.body?.type && req.body.type !== "payment") {
      return;
    }

    const paymentId =
      req.body?.data?.id ||
      req.query['data.id'];

    if (!paymentId) {
      console.log("No paymentId");
      return;
    }

    // obtener payment real
    const payment = await mpService.getPayment(paymentId);

    const orderId = payment.external_reference;

    if (!orderId) {
      console.log("Payment sin external_reference");
      return;
    }

    const order = await orderService.getOrderById(orderId);
    const userId = order.user_id;

    console.log("Payment status:", payment.status);

    // evitar duplicados
    /* ELIMINIADO: pre-chek de duplicados
    const exists = await orderService.paymentExists(payment.id);
    if (exists) {
      console.log("Payment ya registrado");
      return;
    }
    */

    // guardar payment
  // 🟩 REEMPLAZADO: idempotencia basada en DB (UNIQUE mp_payment_id)
    try {

    await orderService.savePayment({
      order_id: orderId,
      user_id: userId,
      preference_id: payment.preference_id, //payment.order?.preference_id 
      payment_id: payment.id,
      merchant_order_id: payment.order?.id,
      status: payment.status,
      status_detail: payment.status_detail,
      payment_method: payment.payment_method_id,
      payment_type: payment.payment_type_id,
      transaction_amount: payment.transaction_amount
    });

} catch (err) {
      if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
        console.log("Payment duplicado detectado por DB");
        // 🟨 IMPORTANTE: NO hacer return aquí (ver abajo)
      } else {
        throw err;
      }
    }
   /*
    🟨 IMPORTANTE:
    No dependemos de si fue insert nuevo o duplicado.
    Siempre procesamos el estado del payment.
    */

    // actualizar orden
       // 🟩 MEJORADO: update de orden SIEMPRE ejecuta si está approved
    if (payment.status === "approved") {
      await orderService.updateOrderStatus(orderId, "approved");
      console.log("Orden aprobada:", orderId);
      console.log("preferenceId:", payment.order?.preference_id);
      //res.redirect(`/success?orderId=${orderId}`); // redirigir a página de éxito con orderId
    }
    

  } catch (error) {
    console.error("Webhook error:", error);
  }
}




module.exports = {
//  createCheckout,
  webhook
};