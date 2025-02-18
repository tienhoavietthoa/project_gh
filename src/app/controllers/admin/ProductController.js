const Product = require('../../../models/product');

const productController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.findAll();
            res.render('admin/product', { products });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = productController; 