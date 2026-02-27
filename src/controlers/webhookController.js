async function mercadopagoWebhook(req, res) {
  const paymentId = req.query['data.id'];

  if (!paymentId) return res.sendStatus(400);

  const payment = await mpService.getPayment(paymentId);

  const orderId = payment.external_reference;

  if (payment.status === "approved") {
    await orderService.updateOrderStatus(orderId, "approved");
  }

  res.sendStatus(200);
}