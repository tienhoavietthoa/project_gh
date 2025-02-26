const Information = require('../../../models/informations');

const customerController = {
    getAllCustomers: function(req, res) {
        Information.findAll()
            .then(customers => res.render('admin/customer', { customers }))  // Render HTML
            .catch(err => res.status(500).json({ error: err.message }));
    },

    delete: function(req, res) {
        const id = req.params.id;

        Information.destroy({ where: { id_information: id } })
            .then(() => res.redirect('/admin/customers'))  // Redirect sau khi xóa
            .catch(err => res.status(500).json({ error: err.message }));
    }
};

module.exports = customerController;