const express = require('express');
const router = express.Router();
const path = require('path');
const homeController = require('../app/controllers/HomeController');
const productRouter = require('./admin/product');
const customerRouter = require('./admin/customer');
const dashboardRouter = require('./admin/dashboard');
const clientAuthRoutes = require('./client/auth');
const cartRoutes = require('./client/cart');
const contactRouter = require('./client/contact');
const orderRoutes = require('./client/order');
const adminOrdersRouter = require('./admin/orders');
const authController = require('../app/controllers/client/AuthController');

const { ensureCustomer, ensureAdmin } = require('../app/middleware/authMiddleware');

// Home route cho web
router.get('/', homeController.index);
router.get('/search', homeController.search);
router.get('/products/:id', ensureCustomer, homeController.productDetail);
router.get('/categories', homeController.categoryList);
router.get('/categories/:id', homeController.productsByCategory);

// API routes cho mobile/app
router.get('/api/home', homeController.index);
router.get('/api/search', homeController.search);
router.get('/api/products/:id', homeController.productDetail);
router.use('/api/cart', cartRoutes);
router.get('/api/profile', homeController.profile);
router.post('/api/profile/edit', homeController.updateProfile);
router.get('/api/categories', homeController.categoryList);
router.get('/api/categories/:id/products', homeController.productsByCategory);
router.post('/api/profile/change-password', homeController.changePassword);
router.post('/api/profile/delete', homeController.deleteAccount);
router.post('/api/auth/reset-password', authController.resetPassword);

// Các route khác
router.use('/contact', contactRouter);
router.use('/admin/products', ensureAdmin, productRouter);
router.use('/admin/customers', ensureAdmin, customerRouter);
router.use('/admin/dashboard', ensureAdmin, dashboardRouter);
router.use('/admin/orders', ensureAdmin, adminOrdersRouter);
router.use('/auth', clientAuthRoutes);
router.use('/cart', ensureCustomer, cartRoutes);
router.use('/order', orderRoutes);

// Test routes
router.get('/vnpay-test', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/vnpay-test.html'));
});

module.exports = router;
