// Cấu hình VNPay - SANDBOX (Môi trường test)
const vnpayConfig = {
    // Thông tin demo chính thức từ VNPay - Updated
    vnp_TmnCode: "VNGROUPDEMO", // Mã demo của VNPay
    vnp_HashSecret: "VNGROUPDEMOSECRET", // Secret key demo
    vnp_Url: "http://10.0.2.2:3000/order/mock-payment", // Mock payment cho demo đẹp (10.0.2.2 để emulator Android truy cập)
    // vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html", // URL thanh toán sandbox thật
    vnp_ReturnUrl: "http://10.0.2.2:3000/order/vnpay/return", // URL trả về sau khi thanh toán
    vnp_IpnUrl: "http://10.0.2.2:3000/order/vnpay/ipn", // URL nhận thông báo từ VNPay
    
    // Dùng 10.0.2.2 thay vì localhost để emulator Android có thể truy cập backend
    // vnp_ReturnUrl: "http://localhost:3000/order/vnpay/return",
    // vnp_IpnUrl: "http://localhost:3000/order/vnpay/ipn",
    
    // Thông tin thay thế nếu demo không hoạt động
    // vnp_TmnCode: "SANDBOX01", 
    // vnp_HashSecret: "SANDBOX01SECRET",
    
    // Cho production thì đổi thành:
    // vnp_Url: "https://vnpayment.vn/paymentv2/vpcpay.html",
    // vnp_ReturnUrl: "https://yourdomain.com/vnpay/return",
    // vnp_IpnUrl: "https://yourdomain.com/vnpay/ipn",
};

module.exports = vnpayConfig;
