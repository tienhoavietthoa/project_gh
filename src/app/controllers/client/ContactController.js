const Contact = require('../../../models/contact');

const contactController = {
    create: async function (req, res) {
        try {
            const { name_contact, phone_contact, text_contact } = req.body;
            const date_contact = new Date();
            await Contact.create({ name_contact, phone_contact, text_contact, date_contact });
            res.status(201).json({ message: 'Liên hệ đã được gửi thành công' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    list: async function (req, res) {
        try {
            const contacts = await Contact.findAll();
            res.render('admin/contacts', { layout: 'main', contacts });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    showContactForm: async function (req, res) {
        res.render('customer/contact', { layout: 'home' });
    }
};

module.exports = contactController;