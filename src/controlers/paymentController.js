const { Order } = require("mercadopago");

function success(req, res) {
    res.render('success', {
        Order
        //query: req.query <p><%= query.status %></p>
/*
        paymentId: req.query.payment_id,
        orderId: req.query.external_reference,
        status: req.query.status
*/
    });
}

function pending(req, res) {
    res.render('pending');
}

function failure(req, res) {
    res.render('failure');
}

module.exports = {
    success,
    pending,
    failure
};