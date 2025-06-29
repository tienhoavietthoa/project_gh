const Contact = require('../../../models/contact');

function wantsJSON(req) {
    return req.xhr || (req.accepts('json') && !req.accepts('html')) || req.method === 'POST';
}

const contactController = {
    create: async function (req, res) {
        try {
            const { name_contact, phone_contact, text_contact } = req.body;
            const date_contact = new Date();
            const contact = await Contact.create({ name_contact, phone_contact, text_contact, date_contact });
            if (wantsJSON(req)) return res.json({ success: true, contact });
            res.redirect('/');
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ success: false, error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    },
    list: async function (req, res) {
        try {
            const contacts = await Contact.findAll();
            if (wantsJSON(req)) return res.json({ success: true, contacts });
            res.render('admin/contacts', { layout: 'main', contacts });
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ success: false, error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    },
    showContactForm: async function (req, res) {
        if (wantsJSON(req)) return res.json({ message: "Show contact form" });
        res.render('customer/contact', { layout: 'home' });
    }
};

module.exports = contactController;