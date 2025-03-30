const { Op } = require('sequelize');
const Information = require('../../../models/informations');
const customerController = {
    getAllCustomers: async function (req, res) {
        try {
            const customers = await Information.findAll();
            res.render('admin/customer', { customers });
        } catch (err) {
            res.status(500).json({ error: err.message });
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
            res.render('admin/customer', { customers });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    delete: async function (req, res) {
        const id = req.params.id;

        try {
            await Information.destroy({ where: { id_information: id } });
            res.redirect('/admin/customers');
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = customerController;