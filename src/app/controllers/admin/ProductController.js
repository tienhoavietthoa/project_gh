const { Op } = require('sequelize');
const Product = require('../../../models/product');
const Category = require('../../../models/category');
const path = require('path');
const fs = require('fs');

function wantsJSON(req) {
    return req.xhr || (req.accepts('json') && !req.accepts('html'));
}

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
            if (wantsJSON(req)) return res.json({ products, currentPage: page, totalPages });
            res.render('admin/product', { products, currentPage: page, totalPages });
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
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
            if (wantsJSON(req)) return res.json({ products, currentPage: page, totalPages });
            res.render('admin/product', { products, currentPage: page, totalPages });
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    },
    create: async function (req, res) {
        try {
            const categories = await Category.findAll();
            if (wantsJSON(req)) return res.json({ categories });
            res.render('admin/createProduct', { categories });
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    },
    store: async function (req, res) {
        const { name_product, price, quantity, dimension, manufacturer, page, author, publisher, publisher_year, text_product, id_category } = req.body;
        const image_product = req.file ? `/img/${req.file.filename}` : null;
        try {
            const product = await Product.create({
                name_product, price, image_product, quantity, dimension, manufacturer, page, author, publisher, publisher_year, text_product, id_category
            });
            if (wantsJSON(req)) return res.json({ success: true, product });
            res.redirect('/admin/products');
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    },
    delete: async function (req, res) {
        const id = req.params.id;
        try {
            const product = await Product.findByPk(id);
            if (product && product.image_product) {
                const imagePath = path.join(__dirname, '../../../../public', product.image_product);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            await Product.destroy({ where: { id_product: id } });
            if (wantsJSON(req)) return res.json({ success: true, message: "Xóa sản phẩm thành công" });
            res.redirect('/admin/products');
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    },
    edit: async function (req, res) {
        const id = req.params.id;
        try {
            const [product, categories] = await Promise.all([
                Product.findByPk(id),
                Category.findAll()
            ]);
            if (wantsJSON(req)) return res.json({ product, categories });
            res.render('admin/editProduct', { product, categories });
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    },
    update: async function (req, res) {
        const id = req.params.id;
        const { name_product, price, quantity, dimension, manufacturer, page, author, publisher, publisher_year, text_product, id_category, existing_image_product } = req.body;
        let image_product = existing_image_product;
        if (req.file) {
            image_product = `/img/${req.file.filename}`;
        }
        try {
            await Product.update(
                { name_product, price, image_product, quantity, dimension, manufacturer, page, author, publisher, publisher_year, text_product, id_category },
                { where: { id_product: id } }
            );
            if (wantsJSON(req)) return res.json({ success: true, message: "Cập nhật sản phẩm thành công" });
            res.redirect('/admin/products');
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    },
};

module.exports = productController;