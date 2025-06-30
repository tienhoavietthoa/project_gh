const express = require('express');
const router = express.Router();
const contactController = require('../../app/controllers/client/ContactController');

// Route cho web
router.post('/create', contactController.create);
router.get('/list', contactController.list);
router.get('/', contactController.showContactForm); // Hiển thị form liên hệ khách hàng

// Route cho API (Android/mobile)
router.post('/api/create', contactController.create);
router.get('/api/list', contactController.list);
router.get('/api', contactController.showContactForm);

module.exports = router;