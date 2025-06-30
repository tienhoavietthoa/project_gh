const express = require('express');
const router = express.Router();
const homeController = require('../app/controllers/HomeController');
const productRouter = require('./admin/product');
const customerRouter = require('./admin/customer');
const dashboardRouter = require('./admin/dashboard');
const clientAuthRoutes = require('./client/auth');
const cartRoutes = require('./client/cart');
const contactRouter = require('./client/contact');
const orderRoutes = require('./client/order'); // Thêm dòng này
const adminOrdersRouter = require('./admin/orders'); // Thêm dòng này
const { ensureCustomer, ensureAdmin } = require('../app/middleware/authMiddleware');

// Home route
router.get('/', homeController.index);
router.get('/search', homeController.search);
router.use('/contact', contactRouter); // Sử dụng route liên hệ
// Sử dụng các route
router.use('/admin/products', ensureAdmin, productRouter);
router.use('/admin/customers', ensureAdmin, customerRouter);
router.use('/admin/dashboard', ensureAdmin, dashboardRouter);
router.use('/admin/orders', ensureAdmin, adminOrdersRouter); // Thêm dòng này
router.use('/auth', clientAuthRoutes);
router.use('/cart', ensureCustomer, cartRoutes);
router.use('/order', ensureCustomer, orderRoutes); // Thêm dòng này

// Add middleware to protect specific routes
router.get('/api/profile', homeController.profile);
router.post('/api/profile/edit', homeController.updateProfile);
router.post('/api/profile/change-password', homeController.changePassword);
router.post('/api/profile/delete', homeController.deleteAccount);
router.get('/products/:id', ensureCustomer, homeController.productDetail);

module.exports = router;