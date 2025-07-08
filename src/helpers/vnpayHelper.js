const crypto = require('crypto');
const moment = require('moment');
const querystring = require('querystring');
const vnpayConfig = require('../config/vnpayConfig');

class VNPayHelper {
    // Tạo URL thanh toán VNPay
    static createPaymentUrl(orderId, amount, orderInfo, ipAddr, bankCode = '') {
        let vnp_Params = {};
        
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = vnpayConfig.vnp_TmnCode;
        vnp_Params['vnp_Amount'] = amount * 100; // VNPay yêu cầu amount * 100
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_ReturnUrl'] = vnpayConfig.vnp_ReturnUrl;
        vnp_Params['vnp_IpnUrl'] = vnpayConfig.vnp_IpnUrl;
        vnp_Params['vnp_CreateDate'] = moment().format('YYYYMMDDHHmmss');
        vnp_Params['vnp_IpAddr'] = ipAddr;
        
        if (bankCode) {
            vnp_Params['vnp_BankCode'] = bankCode;
        }
        
        // Sắp xếp tham số theo thứ tự alphabet
        vnp_Params = this.sortObject(vnp_Params);
        
        // Tạo chuỗi ký theo chuẩn VNPay
        let signData = "";
        let keys = Object.keys(vnp_Params).sort();
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (vnp_Params[key] != null && vnp_Params[key] !== "") {
                signData += key + "=" + vnp_Params[key];
                if (i < keys.length - 1) {
                    signData += "&";
                }
            }
        }
        
        // Tạo chữ ký
        let hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        
        // Tạo URL hoàn chỉnh (có encode)
        return vnpayConfig.vnp_Url + '?' + querystring.stringify(vnp_Params);
    }
    
    // Xác thực chữ ký từ VNPay
    static verifyReturnUrl(vnp_Params) {
        let secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        
        vnp_Params = this.sortObject(vnp_Params);
        
        // Tạo chuỗi ký theo chuẩn VNPay
        let signData = "";
        let keys = Object.keys(vnp_Params).sort();
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (vnp_Params[key] != null && vnp_Params[key] !== "") {
                signData += key + "=" + vnp_Params[key];
                if (i < keys.length - 1) {
                    signData += "&";
                }
            }
        }
        
        let hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        
        return secureHash === signed;
    }
    
    // Sắp xếp object theo key
    static sortObject(obj) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(key);
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = obj[str[key]];
        }
        return sorted;
    }
    
    // Lấy IP address của client
    static getClientIpAddress(req) {
        return req.headers['x-forwarded-for'] ||
               req.connection.remoteAddress ||
               req.socket.remoteAddress ||
               (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
               '127.0.0.1';
    }
}

module.exports = VNPayHelper;
