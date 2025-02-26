const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const productController = require('../../app/controllers/admin/ProductController');
const { ensureAdmin } = require('../../app/middleware/authMiddleware');

// Ensure the directory exists
const imgDir = path.join(__dirname, '../../../public/img');
if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imgDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.use(ensureAdmin);
router.get('/', productController.getAllProducts);
router.post('/', upload.single('image_product'), productController.store);
router.get('/create', productController.create);
router.delete('/:id', productController.delete);
router.get('/edit/:id', productController.edit);
router.put('/:id', upload.single('image_product'), productController.update);

module.exports = router;