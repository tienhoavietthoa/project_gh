const express = require('express');
const path = require('path');
const router = express.Router();
const orderController = require('../../app/controllers/client/OrderController');
const { ensureCustomer } = require('../../app/middleware/authMiddleware');

// Route cho web
router.get('/create', ensureCustomer, orderController.viewOrderForm);
router.post('/create', ensureCustomer, orderController.createOrder);

// Route cho API (Android/mobile)
router.get('/api/create', orderController.viewOrderForm);
router.post('/api/create', orderController.createOrder);

// Route API cho lịch sử và chi tiết đơn hàng
router.get('/api/history', orderController.history);
router.get('/api/detail/:id', orderController.detail);

// Route API kiểm tra trạng thái thanh toán (cho app Android)
router.get('/api/payment-status/:id', orderController.checkPaymentStatus);

// VNPay callback routes
router.get('/vnpay/return', orderController.vnpayReturn);
router.get('/vnpay/ipn', orderController.vnpayIPN);

// Route cho trang kết quả thanh toán VNPay
router.get('/vnpay/result', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/vnpay-result.html'));
});

// Route fake payment để test
router.post('/fake-payment', orderController.fakePayment);

// Route mock payment với giao diện giống VNPay
router.get('/mock-payment', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/mock-payment.html'));
});

module.exports = router;
