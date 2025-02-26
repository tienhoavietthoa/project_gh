const bcrypt = require('bcryptjs');
const Information = require('../../../models/informations');
const Login = require('../../../models/login');

const authController = {
    getLogin(req, res) {
        res.render('auth/login', { layout: 'auth' });
    },

    getRegister(req, res) {
        res.render('auth/register', { layout: 'auth' });
    },

    async postRegister(req, res) {
        const { name_login, pass, phone_information } = req.body;

        try {
            // Kiểm tra số điện thoại đã đăng ký hay chưa
            const existingUser = await Information.findOne({ where: { phone_information } });
            if (existingUser) {
                return res.render('auth/register', { error: 'Số điện thoại đã được đăng ký', layout: 'auth' });
            }

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(pass, 10);

            // Tạo thông tin khách hàng
            const newInformation = await Information.create({
                phone_information
            });

            // Tạo thông tin đăng nhập
            const newLogin = await Login.create({
                name_login,
                pass: hashedPassword,
                date_login: new Date(),
                id_level: 2, // Mặc định là Customer
                id_information: newInformation.id_information
            });

            // Cập nhật id_login trong thông tin khách hàng
            await newInformation.update({ id_login: newLogin.id_login });

            res.redirect('/auth/login');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async postLogin(req, res) {
        const { name_login, pass } = req.body;

        try {
            const user = await Login.findOne({ where: { name_login } });
            if (!user) {
                return res.render('auth/login', { error: 'Tên đăng nhập hoặc mật khẩu không đúng', layout: 'auth' });
            }

            const isMatch = await bcrypt.compare(pass, user.pass);
            if (!isMatch) {
                return res.render('auth/login', { error: 'Tên đăng nhập hoặc mật khẩu không đúng', layout: 'auth' });
            }

            // Truy vấn thông tin người dùng từ bảng information
            const userInfo = await Information.findOne({ where: { id_information: user.id_information } });
            if (!userInfo) {
                return res.render('auth/login', { error: 'Không tìm thấy thông tin người dùng', layout: 'auth' });
            }

            req.session.user = {
                id_login: user.id_login,
                name_login: user.name_login,
                id_level: user.id_level,
                id_information: userInfo.id_information
            };

            // Chuyển hướng đến trang dashboard admin nếu id_level là 1
            if (user.id_level === 1) {
                return res.redirect('/admin/dashboard');
            }

            res.redirect('/');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    logout(req, res) {
        req.session.destroy();
        res.redirect('/auth/login');
    }
};

module.exports = authController;