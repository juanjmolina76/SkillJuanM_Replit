const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const { MERCADOPAGO_API_KEY, BASE_URL } = require('../config');


const client = new MercadoPagoConfig({
  accessToken: MERCADOPAGO_API_KEY
});

const preferenceClient = new Preference(client);// AGREGADO
const paymentClient = new Payment(client);// AGREGADO

console.log(BASE_URL);
console.log(`${BASE_URL}/api/mp/webhook`);

async function createPreference(orderId, items) {
  const response = await preferenceClient.create({
    body: {
      items,
      external_reference: orderId.toString(),
      back_urls: {
        success: `${BASE_URL}/success`,
        failure: `${BASE_URL}/failure`,
        pending: `${BASE_URL}/pending`
      },
      auto_return: "approved",
      notification_url: `${BASE_URL}/api/mp/webhook`,
      //"https://subcerebellar-samira-mesially.ngrok-free.dev/api/mp/webhook"
      //"${BASE_URL}/api/mp/webhook"
      //`${process.env.BASE_URL}/api/mp/webhook`
      binary_mode: true
/*
      notification_url: "https://subcerebellar-samira-mesially.ngrok-free.dev/webhook"
			//"https://localhost:${PORT}/payment/webhook"
			//tiene que ser https (con ssl)
			// ./ngrok.exe http 4000

      */
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