const Product = require('../../models/product');
const Category = require('../../models/category');
const Information = require('../../models/informations');
const { Op } = require('sequelize');

// Thiết lập quan hệ
Category.hasMany(Product, { foreignKey: 'id_category' });
Product.belongsTo(Category, { foreignKey: 'id_category' });

const homeController = {
    index: async function (req, res) {
        try {
            const categories = await Category.findAll({
                include: {
                    model: Product
                }
            });
            res.render('home', { layout: 'home', categories: categories });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    search: async function (req, res) {
        try {
            const searchTerm = req.query.q;
            if (!searchTerm) {
                return res.render('home', { layout: 'home', categories: [] });
            }
            const products = await Product.findAll({
                where: {
                    name_product: {
                        [Op.like]: `%${searchTerm}%`
                    }
                }
            });
            res.render('customer/searchResults', { layout: 'home', products });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    productDetail: async function (req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.render('customer/productDetail', { layout: 'home', product });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    profile: async function (req, res) {
        try {
            const user = await Information.findByPk(req.session.user.id_information);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.render('customer/profile', { layout: 'home', user });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    updateProfile: async function (req, res) {
        try {
            const { name_information, phone_information, email, date_of_birth } = req.body;
            const user = await Information.findByPk(req.session.user.id_information);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            await user.update({ name_information, phone_information, email, date_of_birth });
            res.redirect('/profile');
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = homeController;