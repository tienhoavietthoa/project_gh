const express = require('express');
const router = express.Router();
const VNPayHelper = require('../helpers/vnpayHelper');

// Route test tạo URL VNPay
router.get('/vnpay', (req, res) => {
    const testOrderId = 'TEST_' + Date.now();
    const testAmount = 100000; // 100,000 VND
    const testOrderInfo = 'Test thanh toan VNPay';
    const testIpAddr = VNPayHelper.getClientIpAddress(req);
    
    console.log('=== Test VNPay ===');
    console.log('Test Order ID:', testOrderId);
    console.log('Test Amount:', testAmount);
    console.log('Test Order Info:', testOrderInfo);
    console.log('Test IP Address:', testIpAddr);
    
    const vnpayUrl = VNPayHelper.createPaymentUrl(
        testOrderId,
        testAmount,
        testOrderInfo,
        testIpAddr
    );
    
    console.log('Generated VNPay URL:', vnpayUrl);
    
    res.json({
        success: true,
        orderId: testOrderId,
        amount: testAmount,
        orderInfo: testOrderInfo,
        ipAddr: testIpAddr,
        vnpayUrl: vnpayUrl
    });
});

module.exports = router;
