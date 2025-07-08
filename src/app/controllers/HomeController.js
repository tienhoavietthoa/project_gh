const Product = require('../../models/product');
const Category = require('../../models/category');
const Information = require('../../models/informations');
const Login = require('../../models/login');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// Thiết lập quan hệ
Category.hasMany(Product, { foreignKey: 'id_category' });
Product.belongsTo(Category, { foreignKey: 'id_category' });
Login.belongsTo(Information, { foreignKey: 'id_information' });

// Hàm kiểm tra request có phải API không (ưu tiên cho mobile app)
function wantsJSON(req) {
    // Nếu có header Accept chứa application/json hoặc là request kiểu application/json
    // hoặc query có ?json=1 hoặc user-agent là okhttp (Android Retrofit)
    return req.xhr ||
        (req.get('accept') && req.get('accept').includes('application/json')) ||
        req.is('application/json') ||
        req.query.json === '1' ||
        (req.get('user-agent') && req.get('user-agent').toLowerCase().includes('okhttp'));
}

const homeController = {
    index: async function (req, res) {
        try {
            const categories = await Category.findAll({
                include: {
                    model: Product
                }
            });
            if (wantsJSON(req)) return res.json({ categories });
            res.render('home', { layout: 'home', categories: categories });
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    },
    search: async function (req, res) {
    try {
        const searchTerm = req.query.q;
        if (!searchTerm) {
            if (wantsJSON(req)) return res.json({ products: [] });
            return res.render('home', { layout: 'home', categories: [] });
        }
        const products = await Product.findAll({
            where: {
                name_product: {
                    [Op.like]: `%${searchTerm}%`
                }
            }
        });
        if (wantsJSON(req)) {
            // Nếu không có sản phẩm, trả về products: [] và message
            if (!products || products.length === 0) {
                return res.json({ products: [], message: `Không có dữ liệu cho từ khóa "${searchTerm}"` });
            }
            return res.json({ products });
        }
        // Web: render kèm thông báo nếu không có sản phẩm
        if (!products || products.length === 0) {
            return res.render('customer/searchResults', { layout: 'home', products: [], message: `Không có dữ liệu cho từ khóa "${searchTerm}"` });
        }
        res.render('customer/searchResults', { layout: 'home', products });
    } catch (err) {
        if (wantsJSON(req)) return res.status(500).json({ error: err.message });
        res.status(500).send('Lỗi hệ thống!');
    }
},
    productDetail: async function (req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                if (wantsJSON(req)) return res.status(404).json({ error: 'Product not found' });
                return res.status(404).render('404', { message: 'Product not found' });
            }
            // Sửa dòng này:
            if (wantsJSON(req)) return res.json({ products: [product] });
            res.render('customer/productDetail', { layout: 'home', product });
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    },
    profile: async function (req, res) {
        try {
            let id_login = req.session?.user?.id_login || req.body.id_login || req.query.id_login;
            if (!id_login) {
                if (wantsJSON(req)) return res.status(401).json({ error: "Chưa đăng nhập" });
                return res.redirect('/auth/login');
            }
            const login = await Login.findOne({
                where: { id_login },
                include: [{ model: Information }]
            });
            if (!login || !login.Information) {
                if (wantsJSON(req)) return res.status(404).json({ error: 'User not found' });
                return res.status(404).render('404', { message: 'User not found' });
            }
            if (wantsJSON(req)) {
                return res.json({
                    user: {
                        id_login: login.id_login,
                        name_login: login.name_login,
                        id_level: login.id_level,
                        id_information: login.id_information,
                        ...login.Information.dataValues
                    }
                });
            }
            res.render('customer/profile', { layout: 'home', user: { ...login.dataValues, ...login.Information.dataValues } });
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    },

    updateProfile: async function (req, res) {
        try {
            let id_login = req.session?.user?.id_login || req.body.id_login;
            if (!id_login) {
                if (wantsJSON(req)) return res.status(401).json({ error: "Chưa đăng nhập" });
                return res.redirect('/auth/login');
            }
            const login = await Login.findOne({ where: { id_login } });
            if (!login) {
                if (wantsJSON(req)) return res.status(404).json({ error: 'User not found' });
                return res.status(404).render('404', { message: 'User not found' });
            }
            const { name_information, phone_information, email, date_of_birth } = req.body;
            const info = await Information.findByPk(login.id_information);
            if (!info) {
                if (wantsJSON(req)) return res.status(404).json({ error: 'User info not found' });
                return res.status(404).render('404', { message: 'User info not found' });
            }
            await info.update({ name_information, phone_information, email, date_of_birth });
            if (wantsJSON(req)) return res.json({ success: true, message: 'Cập nhật thông tin thành công!' });
            res.redirect('/profile');
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    },

    changePassword: async function (req, res) {
        try {
            let id_login = req.session?.user?.id_login || req.body.id_login;
            if (!id_login) {
                if (wantsJSON(req)) return res.status(401).json({ error: "Chưa đăng nhập" });
                return res.redirect('/auth/login');
            }
            const { oldPassword, newPassword } = req.body;
            const login = await Login.findOne({ where: { id_login } });
            if (!login) {
                if (wantsJSON(req)) return res.status(404).json({ error: 'User not found' });
                return res.status(404).render('404', { message: 'User not found' });
            }
            const isMatch = await bcrypt.compare(oldPassword, login.pass);
            if (!isMatch) {
                if (wantsJSON(req)) return res.status(400).json({ error: 'Mật khẩu cũ không đúng' });
                return res.status(400).render('customer/profile', { layout: 'home', user: req.session.user, error: 'Mật khẩu cũ không đúng' });
            }
            const hashed = await bcrypt.hash(newPassword, 10);
            await login.update({ pass: hashed });
            if (wantsJSON(req)) return res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
            res.redirect('/profile');
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    },

    deleteAccount: async function (req, res) {
        try {
            let id_login = req.session?.user?.id_login || req.body.id_login;
            if (!id_login) {
                if (wantsJSON(req)) return res.status(401).json({ error: "Chưa đăng nhập" });
                return res.redirect('/auth/login');
            }
            const login = await Login.findOne({ where: { id_login } });
            if (!login) {
                if (wantsJSON(req)) return res.status(404).json({ error: 'User not found' });
                return res.status(404).render('404', { message: 'User not found' });
            }
            await Information.destroy({ where: { id_information: login.id_information } });
            await login.destroy();
            if (wantsJSON(req)) {
                // API: trả về JSON luôn, không render/redirect
                return res.json({ success: true, message: 'Xóa tài khoản thành công!' });
            }
            // Web: xóa session và redirect
            if (req.session) {
                req.session.destroy(() => {
                    res.redirect('/auth/login');
                });
            } else {
                res.redirect('/auth/login');
            }
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    },

    changePassword: async function (req, res) {
        try {
            let id_login = req.session?.user?.id_login || req.body.id_login;
            if (!id_login) {
                if (wantsJSON(req)) return res.status(401).json({ error: "Chưa đăng nhập" });
                return res.redirect('/auth/login');
            }
            const { oldPassword, newPassword } = req.body;
            const login = await Login.findOne({ where: { id_login } });
            if (!login) {
                if (wantsJSON(req)) return res.status(404).json({ error: 'User not found' });
                return res.status(404).render('404', { message: 'User not found' });
            }
            const isMatch = await bcrypt.compare(oldPassword, login.pass);
            if (!isMatch) {
                if (wantsJSON(req)) return res.status(400).json({ error: 'Mật khẩu cũ không đúng' });
                return res.status(400).render('customer/profile', { layout: 'home', user: req.session.user, error: 'Mật khẩu cũ không đúng' });
            }
            const hashed = await bcrypt.hash(newPassword, 10);
            await login.update({ pass: hashed });
            if (wantsJSON(req)) return res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
            res.redirect('/profile');
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    },

    deleteAccount: async function (req, res) {
    try {
        let id_login = req.session?.user?.id_login || req.body.id_login;
        if (!id_login) {
            if (wantsJSON(req)) return res.status(401).json({ error: "Chưa đăng nhập" });
            return res.redirect('/auth/login');
        }
        const login = await Login.findOne({ where: { id_login } });
        if (!login) {
            if (wantsJSON(req)) return res.status(404).json({ error: 'User not found' });
            return res.status(404).render('404', { message: 'User not found' });
        }
        await Information.destroy({ where: { id_information: login.id_information } });
        await login.destroy();
        if (wantsJSON(req)) {
            // API: trả về JSON luôn, không render/redirect
            return res.json({ success: true, message: 'Xóa tài khoản thành công!' });
        }
        // Web: xóa session và redirect
        if (req.session) {
            req.session.destroy(() => {
                res.redirect('/auth/login');
            });
        } else {
            res.redirect('/auth/login');
        }
    } catch (err) {
        if (wantsJSON(req)) return res.status(500).json({ error: err.message });
        res.status(500).send('Lỗi hệ thống!');
    }
},
    categoryList: async function (req, res) {
    try {
        const categories = await Category.findAll();
        if (wantsJSON(req)) return res.json({ categories });
        res.render('customer/categoryList', { layout: 'home', categories });
    } catch (err) {
        if (wantsJSON(req)) return res.status(500).json({ error: err.message });
        res.status(500).send('Lỗi hệ thống!');
    }
},

productsByCategory: async function (req, res) {
    try {
        const id_category = req.params.id;
        const category = await Category.findByPk(id_category, {
            include: [{ model: Product }]
        });
        if (!category) {
            if (wantsJSON(req)) return res.status(404).json({ error: 'Category not found' });
            return res.status(404).render('404', { message: 'Category not found' });
        }
        if (wantsJSON(req)) return res.json({ products: category.products, category });
        res.render('customer/productsByCategory', { layout: 'home', category, products: category.products });
    } catch (err) {
        if (wantsJSON(req)) return res.status(500).json({ error: err.message });
        res.status(500).send('Lỗi hệ thống!');
    }
},
};

module.exports = homeController;