const VNPayHelper = require('./src/helpers/vnpayHelper');

// Test tạo URL VNPay với dữ liệu thật
console.log('🧪 Testing VNPay URL Creation...\n');

// Dữ liệu giống như trong ảnh
const orderId = 25; // Giả sử đây là order ID mới
const amount = 270000; // Tổng tiền từ ảnh
const orderInfo = 'Thanh toan don hang 25';
const ipAddr = '127.0.0.1';

const vnpayUrl = VNPayHelper.createPaymentUrl(orderId, amount, orderInfo, ipAddr);

console.log('Generated VNPay URL:');
console.log(vnpayUrl);
console.log('\n📋 URL Parameters:');

// Parse URL để xem các tham số
const url = new URL(vnpayUrl);
const params = url.searchParams;

console.log('Order ID (vnp_TxnRef):', params.get('vnp_TxnRef'));
console.log('Amount (vnp_Amount):', params.get('vnp_Amount'), '(VNPay format)');
console.log('Amount (display):', (params.get('vnp_Amount') / 100).toLocaleString('vi-VN'), 'VNĐ');
console.log('Order Info (vnp_OrderInfo):', params.get('vnp_OrderInfo'));
console.log('Create Date:', params.get('vnp_CreateDate'));
console.log('Return URL:', params.get('vnp_ReturnUrl'));
console.log('\n🎯 Expected in mock-payment.html:');
console.log('- orderId should be:', params.get('vnp_TxnRef'));
console.log('- amount should be:', params.get('vnp_Amount') / 100);
console.log('- orderInfo should be:', params.get('vnp_OrderInfo'));
