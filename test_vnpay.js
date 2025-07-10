const crypto = require('crypto');
const moment = require('moment');
const querystring = require('querystring');

// Test với thông tin demo chuẩn VNPay
const vnpayConfig = {
    vnp_TmnCode: "VNGROUPDEMO",
    vnp_HashSecret: "VNGROUPDEMOSECRET",
    vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnp_ReturnUrl: "http://localhost:3000/order/vnpay/return",
    vnp_IpnUrl: "http://localhost:3000/order/vnpay/ipn",
};

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]);
    }
    return sorted;
}

function createPaymentUrl(orderId, amount, orderInfo, ipAddr) {
    let vnp_Params = {};
    
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = vnpayConfig.vnp_TmnCode;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_ReturnUrl'] = vnpayConfig.vnp_ReturnUrl;
    vnp_Params['vnp_IpnUrl'] = vnpayConfig.vnp_IpnUrl;
    vnp_Params['vnp_CreateDate'] = moment().format('YYYYMMDDHHmmss');
    vnp_Params['vnp_IpAddr'] = ipAddr;
    
    // Sắp xếp tham số theo thứ tự alphabet
    vnp_Params = sortObject(vnp_Params);
    
    // Tạo query string cho chữ ký (không encode)
    let signData = querystring.stringify(vnp_Params, { encode: false });
    
    console.log('=== VNPay Test Debug ===');
    console.log('Params:', vnp_Params);
    console.log('Sign Data:', signData);
    
    // Tạo chữ ký
    let hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    
    console.log('Generated Signature:', signed);
    
    // Tạo URL hoàn chỉnh (có encode)
    const finalUrl = vnpayConfig.vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: false });
    console.log('Final URL:', finalUrl);
    
    return finalUrl;
}

// Test
const testUrl = createPaymentUrl(
    'TEST123',
    100000,
    'Test payment',
    '127.0.0.1'
);

console.log('Test URL:', testUrl);
