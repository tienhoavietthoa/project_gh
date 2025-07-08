const Order = require('../../../models/order');
const OrderDetail = require('../../../models/order_detail');
const Product = require('../../../models/product');
const VNPayHelper = require('../../../helpers/vnpayHelper');
const querystring = require('querystring');

function wantsJSON(req) {
    return req.xhr
        || (req.accepts('json') && !req.accepts('html'))
        || req.originalUrl.includes('/api/');
}

const orderController = {
    viewOrderForm: (req, res) => {
        if (wantsJSON(req)) return res.json({ cart: req.session.cart || [] });
        res.render('customer/order', { layout: 'home', cart: req.session.cart || [] });
    },

    createOrder: async (req, res) => {
        // Lấy dữ liệu từ body (API) hoặc session (Web)
        const {
            name_order,
            phone_order,
            address_order,
            payment: paymentFromBody,
            total: totalFromBody,
            id_login: idLoginFromBody,
            products // Nếu truyền từ mobile, đây là mảng sản phẩm [{productId, quantity, price}]
        } = req.body;

        // Parse products nếu là string (gửi từ mobile dạng x-www-form-urlencoded)
        let parsedProducts = products;
        if (typeof products === 'string') {
            try { parsedProducts = JSON.parse(products); } catch (e) { parsedProducts = []; }
        }

        // Ưu tiên lấy id_login từ body (API), nếu không có thì lấy từ session (Web)
        const id_login = idLoginFromBody || (req.session.user ? req.session.user.id_login : null);

        // Phương thức thanh toán
        const payment = paymentFromBody || "Trả tiền khi nhận hàng";

        // Tổng tiền
        let total = 0;
        if (typeof totalFromBody !== 'undefined') {
            total = Number(totalFromBody);
        } else if (req.session.cart) {
            total = req.session.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        }

        const date_order = new Date();

        if (!id_login) {
            if (wantsJSON(req)) return res.status(400).json({ success: false, error: 'Người dùng chưa đăng nhập' });
            return res.status(400).send('Người dùng chưa đăng nhập');
        }

        try {
            // Tạo đơn hàng với trạng thái pending nếu thanh toán VNPay
            const paymentStatus = payment.toLowerCase() === 'vnpay' ? 'pending' : 'paid';
            
            const order = await Order.create({
                name_order,
                phone_order,
                address_order,
                payment,
                total,
                date_order,
                id_login,
                payment_status: paymentStatus
            });

            // Lưu chi tiết đơn hàng
            let orderDetails = [];
            // Nếu là API (mobile) truyền products lên
            if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
                orderDetails = parsedProducts.map(item => ({
                    id_order: order.id_order,
                    id_product: item.productId,
                    quantity_detail: item.quantity,
                    price_detail: item.price
                }));
            } else if (req.session.cart && req.session.cart.length > 0) {
                // Nếu là web, lấy từ session.cart
                orderDetails = req.session.cart.map(item => ({
                    id_order: order.id_order,
                    id_product: item.productId,
                    quantity_detail: item.quantity,
                    price_detail: item.price
                }));
            }
            if (orderDetails.length > 0) {
                await OrderDetail.bulkCreate(orderDetails);
            }

            // Xóa giỏ hàng sau khi đặt hàng
            if (req.session.cart) delete req.session.cart;

            // Nếu thanh toán VNPay, tạo URL thanh toán
            if (payment.toLowerCase() === 'vnpay') {
                const ipAddr = VNPayHelper.getClientIpAddress(req);
                const orderInfo = `Thanh toan don hang ${order.id_order}`;
                const vnpayUrl = VNPayHelper.createPaymentUrl(
                    order.id_order,
                    total,
                    orderInfo,
                    ipAddr
                );

                if (wantsJSON(req)) {
                    return res.json({
                        success: true,
                        message: 'Đơn hàng đã được tạo, vui lòng thanh toán',
                        orderId: order.id_order,
                        vnpayUrl: vnpayUrl,
                        paymentStatus: 'pending'
                    });
                }
                return res.redirect(vnpayUrl);
            }

            if (wantsJSON(req)) {
                return res.json({
                    success: true,
                    message: 'Đơn hàng của bạn đã được đặt thành công!',
                    orderId: order.id_order,
                    paymentStatus: 'paid'
                });
            }
            req.session.successMessage = 'Đơn hàng của bạn đã được đặt thành công!';
            res.redirect('/');
        } catch (error) {
            if (wantsJSON(req)) return res.status(500).json({ success: false, error: error.message });
            res.status(500).send('Lỗi hệ thống');
        }
    },

    history: async (req, res) => {
        const id_login = req.body.id_login || req.query.id_login || req.session.user?.id_login;
        if (!id_login) {
            if (wantsJSON(req)) return res.status(401).json({ success: false, error: 'Bạn cần đăng nhập!' });
            return res.redirect('/auth/login');
        }
        const orders = await Order.findAll({
            where: { id_login },
            order: [['date_order', 'DESC']]
        });
        if (wantsJSON(req)) {
            return res.json({
                orders: orders.map(o => ({
                    id_order: o.id_order,
                    name_order: o.name_order,
                    phone_order: o.phone_order,
                    total: o.total,
                    date_order: o.date_order
                }))
            });
        }
        res.render('order_history', { orders });
    },

    // API: Chi tiết đơn hàng
    detail: async (req, res) => {
        const id_order = req.params.id || req.query.id_order;
        if (!id_order) {
            if (wantsJSON(req)) return res.status(400).json({ success: false, error: 'Thiếu id_order' });
            return res.redirect('/order/history');
        }
        // Lấy thông tin đơn hàng
        const order = await Order.findOne({ where: { id_order } });
        if (!order) {
            if (wantsJSON(req)) return res.status(404).json({ success: false, error: 'Không tìm thấy đơn hàng' });
            return res.redirect('/order/history');
        }
        const details = await OrderDetail.findAll({
            where: { id_order },
            include: [{ model: Product, as: 'Product' }] // Đúng alias (chữ P hoa)
        });
        if (wantsJSON(req)) {
    return res.json({
        order: {
            id_order: order.id_order,
            name_order: order.name_order,
            phone_order: order.phone_order,
            address_order: order.address_order,
            payment: order.payment,
            total: order.total,
            date_order: order.date_order
            },
            products: details.map(d => ({
                id_product: d.id_product,
                name_product: d.Product?.name_product || '', // Đúng chữ P hoa
                image_product: d.Product?.image_product || '',
                text_product: d.Product?.text_product || '',
                quantity: d.quantity_detail,
                price: d.price_detail
            }))
        });
    }
            res.render('order_detail', { order, details });
    },

    // API: Kiểm tra trạng thái thanh toán đơn hàng (cho app Android)
    checkPaymentStatus: async (req, res) => {
        const orderId = req.params.id || req.query.orderId;
        
        if (!orderId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Thiếu orderId' 
            });
        }

        try {
            const order = await Order.findOne({ 
                where: { id_order: orderId } 
            });

            if (!order) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Không tìm thấy đơn hàng' 
                });
            }

            return res.json({
                success: true,
                orderId: order.id_order,
                paymentStatus: order.payment_status,
                isPaid: order.payment_status === 'paid'
            });
        } catch (error) {
            return res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    },

    // VNPay callback xử lý kết quả thanh toán
    vnpayReturn: async (req, res) => {
        const vnp_Params = req.query;
        const isValid = VNPayHelper.verifyReturnUrl(vnp_Params);

        if (isValid) {
            const orderId = vnp_Params['vnp_TxnRef'];
            const responseCode = vnp_Params['vnp_ResponseCode'];

            if (responseCode === '00') {
                // Thanh toán thành công
                await Order.update(
                    { payment_status: 'paid' },
                    { where: { id_order: orderId } }
                );

                if (wantsJSON(req)) {
                    return res.json({
                        success: true,
                        message: 'Thanh toán thành công',
                        orderId: orderId
                    });
                }
                // Redirect đến trang kết quả với các tham số
                return res.redirect(`/order/vnpay/result?${querystring.stringify(vnp_Params)}`);
            } else {
                // Thanh toán thất bại
                await Order.update(
                    { payment_status: 'failed' },
                    { where: { id_order: orderId } }
                );

                if (wantsJSON(req)) {
                    return res.json({
                        success: false,
                        message: 'Thanh toán thất bại',
                        orderId: orderId
                    });
                }
                // Redirect đến trang kết quả với các tham số
                return res.redirect(`/order/vnpay/result?${querystring.stringify(vnp_Params)}`);
            }
        } else {
            if (wantsJSON(req)) {
                return res.status(400).json({
                    success: false,
                    message: 'Chữ ký không hợp lệ'
                });
            }
            return res.redirect('/order/failed');
        }
    },

    // VNPay IPN (Instant Payment Notification)
    vnpayIPN: async (req, res) => {
        const vnp_Params = req.query;
        const isValid = VNPayHelper.verifyReturnUrl(vnp_Params);

        if (isValid) {
            const orderId = vnp_Params['vnp_TxnRef'];
            const responseCode = vnp_Params['vnp_ResponseCode'];

            if (responseCode === '00') {
                // Cập nhật trạng thái đơn hàng
                await Order.update(
                    { payment_status: 'paid' },
                    { where: { id_order: orderId } }
                );
            }

            return res.status(200).json({ RspCode: '00', Message: 'success' });
        } else {
            return res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
        }
    },

    // Fake payment để test
    fakePayment: async (req, res) => {
        const { orderId, status } = req.body;
        
        try {
            if (!orderId || !status) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing orderId or status'
                });
            }
            
            const paymentStatus = status === 'success' ? 'paid' : 'failed';
            
            // Cập nhật trạng thái đơn hàng
            await Order.update(
                { payment_status: paymentStatus },
                { where: { id_order: orderId } }
            );
            
            return res.json({
                success: true,
                message: `Payment ${status} (fake)`,
                orderId: orderId
            });
        } catch (error) {
            console.error('Fake payment error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },
};

module.exports = orderController;