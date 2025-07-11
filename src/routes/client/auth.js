const express = require('express');
const router = express.Router();
const authController = require('../../app/controllers/client/AuthController');

// Đăng nhập
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
// Đăng ký
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
// Đăng xuất
router.get('/logout', authController.logout);

module.exports = router;