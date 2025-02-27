const { Op } = require('sequelize');
const Information = require('../../../models/informations');
const customerController = {
    getAllCustomers: function(req, res) {
        Information.findAll()
            .then(customers => res.render('admin/customer', { customers }))  // Render HTML
            .catch(err => res.status(500).json({ error: err.message }));
    },
    searchCustomers: async function(req, res) {
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
    delete: function(req, res) {
        const id = req.params.id;
        Information.destroy({ where: { id_information: id } })
            .then(() => res.redirect('/admin/customers'))  // Redirect sau khi xóa
            .catch(err => res.status(500).json({ error: err.message }));
    }
};
module.exports = customerController;