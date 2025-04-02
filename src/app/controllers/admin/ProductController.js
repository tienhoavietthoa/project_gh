const { Op } = require('sequelize');
const Product = require('../../../models/product');
const Category = require('../../../models/category');
const path = require('path');
const fs = require('fs');

const productController = {
    getAllProducts: async function (req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 3;
            const offset = (page - 1) * limit;
    
            const [products, count] = await Promise.all([
                Product.findAll({ limit: limit, offset: offset }),
                Product.count()
            ]);
    
            const totalPages = Math.ceil(count / limit);
    
            // Log dữ liệu products ra console
            console.log('Products:', products);
    
            res.render('admin/product', { products, currentPage: page, totalPages: totalPages });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    searchProducts: async function (req, res) {
        const { name } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const offset = (page - 1) * limit;
        let query = {};

        if (name) {
            query.name_product = { [Op.like]: `%${name}%` };
        }

        try {
            const [products, count] = await Promise.all([
                Product.findAll({ where: query, limit: limit, offset: offset }),
                Product.count({ where: query })
            ]);

            const totalPages = Math.ceil(count / limit);

            res.render('admin/product', { products, currentPage: page, totalPages: totalPages });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    create: async function (req, res) {
        try {
            const categories = await Category.findAll();
            res.render('admin/createProduct', { categories });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    store: async function (req, res) {
        const { name_product, price, quantity, dimension, manufacturer, page, author, publisher, publisher_year, text_product, id_category } = req.body;
        const image_product = req.file ? `/img/${req.file.filename}` : null;
    
        try {
            await Product.create({
                name_product, price, image_product, quantity, dimension, manufacturer, page, author, publisher, publisher_year, text_product, id_category
            });
            res.redirect('/admin/products');
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    
    delete: async function (req, res) {
        const id = req.params.id;

        try {
            const product = await Product.findByPk(id);
            if (product.image_product) {
                const imagePath = path.join(__dirname, '../../../../public', product.image_product);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            await Product.destroy({ where: { id_product: id } });
            res.redirect('/admin/products');
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    edit: async function (req, res) {
        const id = req.params.id;

        try {
            const [product, categories] = await Promise.all([
                Product.findByPk(id),
                Category.findAll()
            ]);
            res.render('admin/editProduct', { product, categories });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    update: async function (req, res) {
        const id = req.params.id;
        const { name_product, price, quantity, dimension, manufacturer, page, author, publisher, publisher_year, text_product, id_category, existing_image_product } = req.body;
        
        let image_product = existing_image_product; // Mặc định giữ ảnh cũ nếu không upload ảnh mới
    
        if (req.file) {
            // Nếu có ảnh mới, cập nhật ảnh mới
            image_product = `/img/${req.file.filename}`;
        }
    
        try {
            await Product.update(
                { name_product, price, image_product, quantity, dimension, manufacturer, page, author, publisher, publisher_year, text_product, id_category },
                { where: { id_product: id } }
            );
            res.redirect('/admin/products');
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};

module.exports = productController;