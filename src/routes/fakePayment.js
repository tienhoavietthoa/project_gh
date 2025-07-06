const express = require('express');
const router = express.Router();
const orderController = require('../app/controllers/client/OrderController');

router.post('/api/fake-payment-callback', async (req, res) => {
    const { status, name, phone, address, total, idLogin, productsJson } = req.body;
    if (status === 'success') {
        req.body = {
            name_order: name,
            phone_order: phone,
            address_order: address,
            payment: 'VNPAY',
            total,
            id_login: idLogin,
            products: productsJson
        };
        await orderController.createOrder(req, res);
    } else {
        res.json({ success: false, message: 'Thanh toán thất bại' });
    }
});

module.exports = router;