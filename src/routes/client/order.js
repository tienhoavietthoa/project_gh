const express = require('express');
const router = express.Router();
const orderController = require('../../app/controllers/client/OrderController');

// Route để hiển thị form đặt hàng
router.get('/create', orderController.viewOrderForm);

// Route để xử lý việc tạo đơn hàng
router.post('/create', orderController.createOrder);

module.exports = router;