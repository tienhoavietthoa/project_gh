const express = require('express');
const router = express.Router();
const cartController = require('../../app/controllers/client/CartController');

// Route cho web
router.post('/add', cartController.addToCart);
router.get('/', cartController.viewCart);
router.post('/update', cartController.updateCart);
router.post('/remove', cartController.removeFromCart);
router.post('/place-order', cartController.placeOrder);

// Route cho API (Android/mobile)
router.post('/api/add', cartController.addToCart);
router.get('/api', cartController.viewCart);
router.post('/api/update', cartController.updateCart);
router.post('/api/remove', cartController.removeFromCart);
router.post('/api/place-order', cartController.placeOrder);

module.exports = router;