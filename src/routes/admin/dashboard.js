const express = require('express');
const router = express.Router();
const dashboardController = require('../../app/controllers/admin/DashboardController');
const { ensureAdmin } = require('../../app/middleware/authMiddleware');

// Sử dụng middleware để kiểm tra đăng nhập và id_level
router.use(ensureAdmin);

router.get('/', dashboardController.getDashboard);

module.exports = router;