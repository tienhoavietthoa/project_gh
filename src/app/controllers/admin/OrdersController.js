const { Order, OrderDetail, Product } = require('../../../models/associations');

function wantsJSON(req) {
    return req.xhr || (req.accepts('json') && !req.accepts('html'));
}

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        if (wantsJSON(req)) return res.json({ orders });
        res.render("admin/orders", { orders });
    } catch (error) {
        if (wantsJSON(req)) return res.status(500).json({ error: error.message });
        res.status(500).send("Lỗi máy chủ");
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const { id_order } = req.params;
        const order = await Order.findOne({ where: { id_order } });
        if (!order) {
            if (wantsJSON(req)) return res.status(404).json({ error: "Không tìm thấy đơn hàng!" });
            return res.status(404).send("🚫 Không tìm thấy đơn hàng!");
        }
        const details = await OrderDetail.findAll({
            where: { id_order },
            include: [{
                model: Product,
                as: "Product",
                attributes: ["id_product", "name_product", "price"]
            }]
        });
        const formattedDetails = details.map(detail => ({
            id_product: detail.id_product,
            name_product: detail.Product?.name_product || null,
            price: detail.Product?.price || null,
            quantity_detail: detail.quantity_detail,
            price_detail: detail.price_detail
        }));
        if (wantsJSON(req)) return res.json({ order, orderDetails: formattedDetails });
        res.render("admin/order_details", { order, orderDetails: formattedDetails });
    } catch (error) {
        if (wantsJSON(req)) return res.status(500).json({ error: error.message });
        res.status(500).send("Lỗi máy chủ");
    }
};

exports.getOrder = async (req, res) => {
    try {
        const { id_order } = req.params;
        const order = await Order.findOne({ where: { id_order } });
        if (!order) {
            if (wantsJSON(req)) return res.status(404).json({ error: "Không tìm thấy đơn hàng!" });
            return res.status(404).send("🚫 Không tìm thấy đơn hàng!");
        }
        if (wantsJSON(req)) return res.json({ order });
        res.render("admin/order", { order });
    } catch (error) {
        if (wantsJSON(req)) return res.status(500).json({ error: error.message });
        res.status(500).send("Lỗi máy chủ");
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { id_order } = req.params;
        const order = await Order.findOne({ where: { id_order } });
        if (!order) {
            if (wantsJSON(req)) return res.status(404).json({ error: "Không tìm thấy đơn hàng!" });
            return res.status(404).send("🚫 Không tìm thấy đơn hàng!");
        }
        await OrderDetail.destroy({ where: { id_order } });
        await Order.destroy({ where: { id_order } });
        if (wantsJSON(req)) return res.json({ success: true, message: "Đã xóa đơn hàng!" });
        res.redirect("/admin/orders");
    } catch (error) {
        if (wantsJSON(req)) return res.status(500).json({ error: error.message });
        res.status(500).send("Lỗi máy chủ");
    }
};