const express = require('express');
const router = express.Router();
const orderController = require('../../app/controllers/client/OrderController');
const { ensureCustomer } = require('../../app/middleware/authMiddleware');

// Route cho web
router.get('/create', ensureCustomer, orderController.viewOrderForm);
router.post('/create', ensureCustomer, orderController.createOrder);

// Route cho API (Android/mobile)
router.get('/api/create', orderController.viewOrderForm);
router.post('/api/create', orderController.createOrder);

// Thêm route API cho lịch sử và chi tiết đơn hàng
router.get('/api/history', orderController.history);
router.get('/api/detail/:id', orderController.detail);

module.exports = router;