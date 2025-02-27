const express = require('express');
const router = express.Router();
const contactController = require('../../app/controllers/client/ContactController');

router.post('/create', contactController.create);
router.get('/list', contactController.list);
router.get('/', contactController.showContactForm); // Hiển thị form liên hệ khách hàng

module.exports = router;