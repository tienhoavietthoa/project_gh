const express = require('express');
const router = express.Router();

// Import các route
const productRouter = require('./admin/product');

// Sử dụng các route
router.use('/admin/products', productRouter);

module.exports = router;