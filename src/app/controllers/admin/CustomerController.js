const { Op } = require('sequelize');
const Information = require('../../../models/informations');

function wantsJSON(req) {
    return req.xhr || (req.accepts('json') && !req.accepts('html'));
}

const customerController = {
    getAllCustomers: async function (req, res) {
        try {
            const customers = await Information.findAll();
            if (wantsJSON(req)) return res.json({ customers });
            res.render('admin/customer', { customers });
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    },

    searchCustomers: async function (req, res) {
        const { name } = req.query;
        let query = {};

        if (name) {
            query.name_information = { [Op.like]: `%${name}%` };
        }

        try {
            const customers = await Information.findAll({ where: query });
            if (wantsJSON(req)) return res.json({ customers });
            res.render('admin/customer', { customers });
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    },

    delete: async function (req, res) {
        const id = req.params.id;

        try {
            await Information.destroy({ where: { id_information: id } });
            if (wantsJSON(req)) return res.json({ success: true, message: "Xóa khách hàng thành công!" });
            res.redirect('/admin/customers');
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    }
};

module.exports = customerController;