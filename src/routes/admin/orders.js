const express = require("express");
const router = express.Router();
const OrdersController = require("../../app/controllers/admin/OrdersController");

// Route hiển thị danh sách đơn hàng
router.get("/", OrdersController.getOrders);

// Route xem chi tiết đơn hàng
router.get("/details/:id_order", OrdersController.getOrderDetails);

// Route lấy chi tiết đơn hàng
router.get("/:id_order", OrdersController.getOrder);

// Route xóa đơn hàng
router.delete("/:id_order", OrdersController.deleteOrder);

module.exports = router;