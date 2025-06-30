const bcrypt = require('bcryptjs');
const Information = require('../../../models/informations');
const Login = require('../../../models/login');

function wantsJSON(req) {
    // Ưu tiên Accept: application/json hoặc request từ app (Retrofit)
    return req.xhr || (req.get('accept') && req.get('accept').includes('application/json'));
}

const authController = {
    getLogin(req, res) {
        if (wantsJSON(req)) return res.json({ message: "Show login form" });
        res.render('auth/login', { layout: 'auth' });
    },

    getRegister(req, res) {
        if (wantsJSON(req)) return res.json({ message: "Show register form" });
        res.render('auth/register', { layout: 'auth' });
    },

    async postRegister(req, res) {
        const { name_login, pass, phone_information } = req.body;
        try {
            const existingUser = await Information.findOne({ where: { phone_information } });
            if (existingUser) {
                // Luôn trả về JSON nếu là request từ app (Retrofit hoặc Accept: application/json)
                if (wantsJSON(req) || req.method === 'POST') {
                    return res.status(400).json({ success: false, error: "Số điện thoại đã được đăng ký" });
                }
                return res.render('auth/register', { error: 'Số điện thoại đã được đăng ký', layout: 'auth' });
            }
            const hashedPassword = await bcrypt.hash(pass, 10);
            const newInformation = await Information.create({ phone_information });
            const newLogin = await Login.create({
                name_login,
                pass: hashedPassword,
                date_login: new Date(),
                id_level: 2,
                id_information: newInformation.id_information
            });
            await newInformation.update({ id_login: newLogin.id_login });

            // Luôn trả về JSON nếu là request từ app (Retrofit hoặc Accept: application/json)
            if (wantsJSON(req) || req.method === 'POST') {
                return res.json({
                    success: true,
                    message: "Đăng ký thành công!",
                    user: {
                        id_login: newLogin.id_login,
                        name_login: newLogin.name_login,
                        id_level: newLogin.id_level,
                        id_information: newInformation.id_information
                    }
                });
            }
            // Trường hợp web
            res.redirect('/auth/login');
        } catch (error) {
            // Luôn trả về JSON nếu là request từ app (Retrofit hoặc Accept: application/json)
            if (wantsJSON(req) || req.method === 'POST') {
                return res.status(500).json({ success: false, error: error.message });
            }
            res.render('auth/register', { error: error.message, layout: 'auth' });
        }
    },

    async postLogin(req, res) {
        const { name_login, pass } = req.body;
        try {
            const user = await Login.findOne({ where: { name_login } });
            if (!user) {
                if (wantsJSON(req) || req.method === 'POST') {
                    return res.status(401).json({ success: false, error: "Tên đăng nhập hoặc mật khẩu không đúng" });
                }
                return res.render('auth/login', { error: 'Tên đăng nhập hoặc mật khẩu không đúng', layout: 'auth' });
            }
            const isMatch = await bcrypt.compare(pass, user.pass);
            if (!isMatch) {
                if (wantsJSON(req) || req.method === 'POST') {
                    return res.status(401).json({ success: false, error: "Tên đăng nhập hoặc mật khẩu không đúng" });
                }
                return res.render('auth/login', { error: 'Tên đăng nhập hoặc mật khẩu không đúng', layout: 'auth' });
            }
            const userInfo = await Information.findOne({ where: { id_information: user.id_information } });
            if (!userInfo) {
                if (wantsJSON(req) || req.method === 'POST') {
                    return res.status(404).json({ success: false, error: "Không tìm thấy thông tin người dùng" });
                }
                return res.render('auth/login', { error: 'Không tìm thấy thông tin người dùng', layout: 'auth' });
            }
            req.session.user = {
                id_login: user.id_login,
                name_login: user.name_login,
                id_level: user.id_level,
                id_information: userInfo.id_information
            };
            if (wantsJSON(req) || req.method === 'POST') {
                return res.json({
                    success: true,
                    user: req.session.user
                });
            }
            if (user.id_level === 1) return res.redirect('/admin/dashboard');
            res.redirect('/');
        } catch (error) {
            if (wantsJSON(req) || req.method === 'POST') {
                return res.status(500).json({ success: false, error: error.message });
            }
            res.render('auth/login', { error: error.message, layout: 'auth' });
        }
    },
    
    logout(req, res) {
        req.session.destroy(() => {
            if (wantsJSON(req) || req.method === 'POST') {
                return res.json({ success: true, message: "Đã đăng xuất" });
            }
            res.redirect('/auth/login');
        });
    }
};

module.exports = authController;