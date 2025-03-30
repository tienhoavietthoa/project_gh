const Order = require('../../../models/order');
const OrderDetail = require('../../../models/order_detail');

const orderController = {
    viewOrderForm: (req, res) => {
        res.render('customer/order', { layout: 'home', cart: req.session.cart || [] });
    },

    createOrder: async (req, res) => {
        const { name_order, phone_order, address_order } = req.body;
        const payment = "Trả tiền khi nhận hàng";
        const total = req.session.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const date_order = new Date();
        const id_login = req.session.user ? req.session.user.id_login : null; // Kiểm tra req.session.user trước khi truy cập thuộc tính id_login

        if (!id_login) {
            return res.status(400).send('Người dùng chưa đăng nhập');
        }

        try {
            // Tạo đơn hàng mới
            const order = await Order.create({
                name_order,
                phone_order,
                address_order,
                payment,
                total,
                date_order,
                id_login
            });

            // Tạo chi tiết đơn hàng
            const orderDetails = req.session.cart.map(item => ({
                id_order: order.id_order,
                id_product: item.productId,
                quantity_detail: item.quantity,
                price_detail: item.price
            }));

            await OrderDetail.bulkCreate(orderDetails);

            // Xóa giỏ hàng
            delete req.session.cart;

            // Chuyển hướng tới trang chủ với thông báo
            req.session.successMessage = 'Đơn hàng của bạn đã được đặt thành công!';
            res.redirect('/');
        } catch (error) {
            console.error('❌ Lỗi khi tạo đơn hàng:', error);
            res.status(500).send('Lỗi hệ thống');
        }
    }
};

module.exports = orderController;