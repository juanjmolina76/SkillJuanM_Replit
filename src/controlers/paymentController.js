const orderService = require('../services/orderService');

async function success(req, res) {
    try {

        const order = await orderService.getOrderById(
            req.query.external_reference
        );

        res.render('success', {
            order

                    //query: req.query <p><%= query.status %></p>
/*
        paymentId: req.query.payment_id,
        orderId: req.query.external_reference,
        status: req.query.status
*/
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error obteniendo la orden.");
    }
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