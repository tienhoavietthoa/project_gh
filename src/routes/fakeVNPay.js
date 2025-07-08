// Fake VNPay payment for testing
const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Route giả lập thanh toán thành công
router.get('/fake-success/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    
    try {
        // Cập nhật trạng thái đơn hàng
        await Order.update(
            { payment_status: 'paid' },
            { where: { id_order: orderId } }
        );
        
        res.json({
            success: true,
            message: 'Payment successful (fake)',
            orderId: orderId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating order',
            error: error.message
        });
    }
});

// Route giả lập thanh toán thất bại
router.get('/fake-fail/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    
    try {
        // Cập nhật trạng thái đơn hàng
        await Order.update(
            { payment_status: 'failed' },
            { where: { id_order: orderId } }
        );
        
        res.json({
            success: true,
            message: 'Payment failed (fake)',
            orderId: orderId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating order',
            error: error.message
        });
    }
});

module.exports = router;
