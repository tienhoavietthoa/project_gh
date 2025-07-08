const express = require('express');
const router = express.Router();
const contactController = require('../../app/controllers/client/ContactController');
const { ensureCustomer } = require('../../app/middleware/authMiddleware');

// Route cho web (cần đăng nhập)
router.get('/', ensureCustomer, contactController.showContactForm);
router.post('/create', ensureCustomer, contactController.create);
router.get('/list', ensureCustomer, contactController.list);

// Route cho API (KHÔNG dùng ensureCustomer)
router.get('/api', contactController.showContactForm);
router.post('/api/create', contactController.create);
router.get('/api/list', contactController.list);

module.exports = router;