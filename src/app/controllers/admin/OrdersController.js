const Order = require("../../../models/order");
const OrderDetail = require("../../../models/order_detail");
const Product = require("../../../models/product");

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.render("admin/orders", { orders });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        res.status(500).send("Lỗi máy chủ");
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const { id_order } = req.params;

        const order = await Order.findOne({
            where: { id_order }
        });

        if (!order) {
            return res.status(404).send("Không tìm thấy đơn hàng!");
        }

        const details = await OrderDetail.findAll({
            where: { id_order },
            include: [
                {
                    model: Product,
                    attributes: ["id_product", "name_product", "price"]
                }
            ]
        });

        const formattedDetails = details.map(detail => ({
            id_product: detail.id_product,
            name_product: detail.product ? detail.product.name_product : "Không có tên",
            price: detail.product ? detail.product.price : "Chưa có giá",
            quantity_detail: detail.quantity_detail,
            price_detail: detail.price_detail
        }));

        res.render("admin/order_details", { order, orderDetails: formattedDetails });
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        res.status(500).send("Lỗi máy chủ");
    }
};

exports.getOrder = async (req, res) => {
    try {
        const { id_order } = req.params;

        const order = await Order.findOne({
            where: { id_order }
        });

        if (!order) {
            return res.status(404).send("Không tìm thấy đơn hàng!");
        }

        res.render("admin/order", { order });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
        res.status(500).send("Lỗi máy chủ");
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { id_order } = req.params;

        const order = await Order.findOne({
            where: { id_order }
        });

        if (!order) {
            return res.status(404).send("Không tìm thấy đơn hàng!");
        }

        await OrderDetail.destroy({
            where: { id_order }
        });

        await Order.destroy({
            where: { id_order }
        });

        res.redirect("/admin/orders");
    } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error);
        res.status(500).send("Lỗi máy chủ");
    }
};