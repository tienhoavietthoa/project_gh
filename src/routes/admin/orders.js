const express = require("express");
const router = express.Router();
const OrdersController = require("../../app/controllers/admin/OrdersController");

// 📌 Route hiển thị danh sách đơn hàng
router.get("/", OrdersController.getOrders);

// 📌 Route xem chi tiết đơn hàng
router.get("/orders/:id_order/details", OrdersController.getOrderDetails);

// 📌 Route lấy thông tin đơn hàng (tóm tắt)
router.get("/orders/:id_order", OrdersController.getOrder);

// 📌 Route xóa đơn hàng
router.get("/details/:id_order", OrdersController.getOrderDetails);


module.exports = router;