const Order = require('../../../models/order');
const OrderDetail = require('../../../models/order_detail');
const Product = require('../../../models/product');

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
            // Tạo đơn hàng
            const order = await Order.create({
                name_order,
                phone_order,
                address_order,
                payment,
                total,
                date_order,
                id_login
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

            if (wantsJSON(req)) {
                return res.json({
                    success: true,
                    message: 'Đơn hàng của bạn đã được đặt thành công!',
                    orderId: order.id_order
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
};

module.exports = orderController;