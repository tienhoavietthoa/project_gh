const express = require('express');
const router = express.Router();
const productController = require('../../app/controllers/admin/ProductController');

router.get('/', productController.getAllProducts);

module.exports = router;