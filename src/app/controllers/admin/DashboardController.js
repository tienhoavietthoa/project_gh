const Product = require('../../../models/product');
const Information = require('../../../models/informations');

const dashboardController = {
    getDashboard: async function (req, res) {
        try {
            const totalProducts = await Product.count();
            const totalCustomers = await Information.count();

            res.render('admin/dashboard', { 
                layout: 'main', 
                user: req.session.user,
                totalProducts: totalProducts,
                totalCustomers: totalCustomers 
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = dashboardController;