const express = require('express');
const router = express.Router();
const customerController = require('../../app/controllers/admin/CustomerController');
const { ensureAdmin } = require('../../app/middleware/authMiddleware');

// Sử dụng middleware để kiểm tra đăng nhập và id_level
router.use(ensureAdmin);

// Routes
router.get('/', customerController.getAllCustomers);
router.delete('/:id', customerController.delete);

module.exports = router;