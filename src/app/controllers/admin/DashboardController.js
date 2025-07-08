const Product = require('../../../models/product');
const Information = require('../../../models/informations');
const Order = require('../../../models/order');

function wantsJSON(req) {
    return req.xhr || (req.accepts('json') && !req.accepts('html'));
}

const dashboardController = {
    getDashboard: async function (req, res) {
        try {
            const [totalProducts, totalCustomers, totalOrders, totalRevenue] = await Promise.all([
                Product.count(),
                Information.count(),
                Order.count(),
                Order.sum('total')
            ]);
            if (wantsJSON(req)) return res.json({
                totalProducts, totalCustomers, totalOrders, totalRevenue: totalRevenue || 0
            });
            res.render('admin/dashboard', {
                layout: 'main',
                user: req.session.user,
                totalProducts,
                totalCustomers,
                totalOrders,
                totalRevenue: totalRevenue || 0
            });
        } catch (err) {
            if (wantsJSON(req)) return res.status(500).json({ error: err.message });
            res.status(500).send('Lỗi hệ thống!');
        }
    }
};

module.exports = dashboardController;