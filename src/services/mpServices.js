const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const { MERCADOPAGO_API_KEY } = require('../config');

const client = new MercadoPagoConfig({
  accessToken: MERCADOPAGO_API_KEY
});

const preferenceClient = new Preference(client);
const paymentClient = new Payment(client);

async function createPreference(orderId, items) {
  const response = await preferenceClient.create({
    body: {
      items,
      external_reference: orderId.toString(),
      back_urls: {
        success: `${process.env.BASE_URL}/success`,
        failure: `${process.env.BASE_URL}/failure`,
        pending: `${process.env.BASE_URL}/pending`
      },
      auto_return: "approved",
      notification_url: `${process.env.BASE_URL}/webhook`
    }
  });

  return response;
}

async function getPayment(paymentId) {
  return await paymentClient.get({ id: paymentId });
}

module.exports = {
  createPreference,
  getPayment
};