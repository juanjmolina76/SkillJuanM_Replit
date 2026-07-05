const orderService = require('../services/orderService');
const mpService = require('../services/mpService');
const facturaRepository = require('../../repositories/facturaRepository');
const arcaService = require('../services/arcaService');

async function mercadopagoWebhook(req, res) {
  const paymentId = req.query['data.id'];

  if (!paymentId) return res.sendStatus(400);

  const payment = await mpService.getPayment(paymentId);

  const orderId = payment.external_reference;

  if (payment.status === "approved") {
    await orderService.updateOrderStatus(orderId, "approved");
  }


/*AGREGADO PARA MARCAR COMO PAGADO */
/* await orderService.savePayments(orderId); */ /* ERA markAsPaid savePayments ó hay que atregar
un metodo nuevo en orderService que se llame markAsPaid */

const facturaExistente =
  await facturaRepository.findByOrderId(orderId);

if (!facturaExistente) {
  await arcaService.emitirFactura(orderId);
}
/*FIN AGREGADO PARA MARCAR COMO PAGADO*/



  res.sendStatus(200);
}

module.exports = {
//  createCheckout,
  mercadopagoWebhook
};