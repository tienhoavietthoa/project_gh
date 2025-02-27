const express = require('express');
const router = express.Router();
const homeController = require('../app/controllers/HomeController');
const productRouter = require('./admin/product');
const customerRouter = require('./admin/customer');
const dashboardRouter = require('./admin/dashboard');
const clientAuthRoutes = require('./client/auth');
const { ensureCustomer } = require('../app/middleware/authMiddleware');
const contactRouter = require('./client/contact');

// Home route
router.get('/', homeController.index);
router.get('/search', homeController.search);
router.use('/contact', contactRouter); // Sử dụng route liên hệ
// Sử dụng các route
router.use('/admin/products', productRouter);
router.use('/admin/customers', customerRouter);
router.use('/admin/dashboard', dashboardRouter);
router.use('/auth', clientAuthRoutes);

// Add middleware to protect specific routes
router.get('/cart', ensureCustomer, (req, res) => {
    res.render('cart', { layout: 'main' });
});

router.get('/profile', ensureCustomer, homeController.profile);
router.post('/profile/edit', ensureCustomer, homeController.updateProfile);

router.get('/products/:id', ensureCustomer, homeController.productDetail);

module.exports = router;