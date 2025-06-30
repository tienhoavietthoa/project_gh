const express = require('express');
const router = express.Router();
const orderController = require('../../app/controllers/client/OrderController');

// Route cho web
router.get('/create', orderController.viewOrderForm);
router.post('/create', orderController.createOrder);

// Route cho API (Android/mobile)
router.get('/api/create', orderController.viewOrderForm);
router.post('/api/create', orderController.createOrder);

module.exports = router;