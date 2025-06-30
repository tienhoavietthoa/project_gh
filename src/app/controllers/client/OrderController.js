const Order = require('../../../models/order');
const OrderDetail = require('../../../models/order_detail');

function wantsJSON(req) {
    return req.xhr || (req.accepts('json') && !req.accepts('html')) || req.originalUrl.startsWith('/api/');
}

const orderController = {
    viewOrderForm: (req, res) => {
        if (wantsJSON(req)) return res.json({ cart: req.session.cart || [] });
        res.render('customer/order', { layout: 'home', cart: req.session.cart || [] });
    },

    createOrder: async (req, res) => {
        const { name_order, phone_order, address_order } = req.body;
        const payment = "Trả tiền khi nhận hàng";
        const total = req.session.cart ? req.session.cart.reduce((acc, item) => acc + item.price * item.quantity, 0) : 0;
        const date_order = new Date();
        const id_login = req.session.user ? req.session.user.id_login : null;

        if (!id_login) {
            if (wantsJSON(req)) return res.status(400).json({ success: false, error: 'Người dùng chưa đăng nhập' });
            return res.status(400).send('Người dùng chưa đăng nhập');
        }

        try {
            const order = await Order.create({
                name_order,
                phone_order,
                address_order,
                payment,
                total,
                date_order,
                id_login
            });

            const orderDetails = (req.session.cart || []).map(item => ({
                id_order: order.id_order,
                id_product: item.productId,
                quantity_detail: item.quantity,
                price_detail: item.price
            }));

            await OrderDetail.bulkCreate(orderDetails);
            delete req.session.cart;
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
    }
};

module.exports = orderController;