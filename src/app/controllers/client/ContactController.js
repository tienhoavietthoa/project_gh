const Contact = require('../../../models/contact');
const Login = require('../../../models/login'); // Model tài khoản

const ContactController = {
    showContactForm: async (req, res) => {
        const id_login = req.body.id_login || req.query.id_login || req.session.user?.id_login;
        if (!id_login) {
            if (req.originalUrl.includes('/api')) return res.status(401).json({ error: 'Bạn cần đăng nhập!' });
            return res.redirect('/auth/login');
        }
        const user = await Login.findOne({ where: { id_login } });
        if (!user) {
            if (req.originalUrl.includes('/api')) return res.status(404).json({ error: 'Không tìm thấy tài khoản!' });
            return res.redirect('/auth/login');
        }
        const messages = await Contact.findAll({
            where: { id_login },
            order: [['date_contact', 'DESC']]
        });
        if (req.originalUrl.includes('/api')) {
            return res.json({
                name_contact: user.name_login,
                messages: messages.map(m => ({
                id_contact: m.id_contact,
                name_contact: m.name_contact,
                phone_contact: String(m.phone_contact), // luôn trả về chuỗi
                text_contact: m.text_contact,
                date_contact: m.date_contact
            }))
            });
        }
        res.render('contact', {
            name_contact: user.name_login,
            messages
        });
    },

    create: async (req, res) => {
        const id_login = req.body.id_login || req.query.id_login || req.session.user?.id_login;
        const text_contact = req.body.text_contact;
        const phone_contact = req.body.phone_contact;

        if (!id_login || !text_contact || !phone_contact) {
            if (req.originalUrl.includes('/api')) return res.status(400).json({ error: 'Thiếu thông tin!' });
            return res.redirect('/contact?error=Thiếu thông tin');
        }

        const user = await Login.findOne({ where: { id_login } });
        const name_contact = user?.name_login || '';

        await Contact.create({
            name_contact,
            phone_contact,
            text_contact,
            date_contact: new Date(),
            id_login
        });

        if (req.originalUrl.includes('/api')) {
            return res.json({ success: true, message: 'Đã gửi tin nhắn!' });
        }
        res.redirect('/contact?success=Đã gửi tin nhắn');
    },

    list: async (req, res) => {
        const id_login = req.body.id_login || req.query.id_login || req.session.user?.id_login;
        if (!id_login) {
            if (req.originalUrl.includes('/api')) return res.status(401).json({ error: 'Bạn cần đăng nhập!' });
            return res.redirect('/auth/login');
        }
        const messages = await Contact.findAll({
            where: { id_login },
            order: [['date_contact', 'DESC']]
        });
        if (req.originalUrl.includes('/api')) {
            return res.json({
                messages: messages.map(m => ({
                    id_contact: m.id_contact,
                    name_contact: m.name_contact,
                    phone_contact: m.phone_contact,
                    text_contact: m.text_contact,
                    date_contact: m.date_contact
                }))
            });
        }
        res.render('contact_list', { messages });
    }
};

module.exports = ContactController;
