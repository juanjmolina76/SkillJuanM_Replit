const mpService = require('../services/mpService');
const orderService = require('../services/orderService');

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

async function webhook(req, res) {
  try {
    const paymentId = req.query['data.id'];

    if (!paymentId) return res.sendStatus(400);

    const payment = await mpService.getPayment(paymentId);

    const orderId = payment.external_reference;

    if (payment.status === "approved") {
      await orderService.updateOrderStatus(orderId, "approved");
    }

    res.sendStatus(200);

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

module.exports = {
  createCheckout,
  webhook
};