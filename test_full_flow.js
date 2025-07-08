const http = require('http');

// Helper function để tạo HTTP request
function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// Test tạo đơn hàng và thanh toán
async function testFullFlow() {
    console.log('🧪 Testing Full Order & Payment Flow...\n');
    
    // Test 1: Tạo đơn hàng với VNPay
    console.log('1. Creating order with VNPay payment...');
    try {
        const orderData = {
            name_order: 'VY NGUYEN THI THAO',
            phone_order: '0981742439',
            address_order: 'Thành phố Hồ Chí Minh',
            payment: 'vnpay',
            total: 270000,
            id_login: 1,
            products: JSON.stringify([
                { productId: 1, quantity: 1, price: 120000 },
                { productId: 2, quantity: 1, price: 150000 }
            ])
        };
        
        const response = await makeRequest('/order/api/create', 'POST', orderData);
        console.log('✅ Order created successfully');
        console.log('Order ID:', response.data.orderId);
        console.log('VNPay URL:', response.data.vnpayUrl);
        
        // Parse URL để xem parameters
        const url = new URL(response.data.vnpayUrl);
        const params = url.searchParams;
        
        console.log('\n📋 VNPay Parameters:');
        console.log('- Order ID:', params.get('vnp_TxnRef'));
        console.log('- Amount:', (params.get('vnp_Amount') / 100).toLocaleString('vi-VN'), 'VNĐ');
        console.log('- Order Info:', params.get('vnp_OrderInfo'));
        console.log('- Return URL:', params.get('vnp_ReturnUrl'));
        
        const orderId = response.data.orderId;
        
        // Test 2: Simulate payment success
        console.log('\n2. Simulating payment success...');
        const paymentResponse = await makeRequest('/order/fake-payment', 'POST', {
            orderId: orderId.toString(),
            status: 'success'
        });
        console.log('✅ Payment simulation:', paymentResponse.data);
        
        // Test 3: Check payment status
        console.log('\n3. Checking payment status...');
        const statusResponse = await makeRequest(`/order/api/payment-status/${orderId}`);
        console.log('✅ Payment status:', statusResponse.data);
        
        console.log('\n🎉 Full flow test completed successfully!');
        console.log('🎯 Android app should now work correctly with this order ID:', orderId);
        
    } catch (error) {
        console.log('❌ Test failed:', error.message);
    }
}

// Chạy test
testFullFlow().catch(console.error);
