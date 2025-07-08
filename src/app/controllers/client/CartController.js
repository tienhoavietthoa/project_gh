const Cart = require('../../../models/cart');
const CartDetail = require('../../../models/cart_detail');
const Product = require('../../../models/product');

function wantsJSON(req) {
    // Nếu là API (bắt đầu bằng /api/), luôn trả JSON
    if (req.originalUrl.startsWith('/api/')) return true;
    return req.xhr || (req.accepts('json') && !req.accepts('html')) || req.method === 'POST';
}

const cartController = {
    addToCart: async function (req, res) {
    const productId = parseInt(req.body.productId);
    const quantity = parseInt(req.body.quantity) || 1;
    // Ưu tiên session, nếu không có thì lấy từ body/query
    const userId = req.session.user?.id_login || req.body.id_login || req.query.id_login;
    if (!userId) {
        if (wantsJSON(req)) return res.status(401).json({ success: false, error: 'Bạn cần đăng nhập!' });
        return res.redirect('/auth/login');
    }
    try {
        let cart = await Cart.findOne({ where: { id_login: userId } });
        if (!cart) cart = await Cart.create({ id_login: userId });
        let cartDetail = await CartDetail.findOne({
            where: { id_cart: cart.id_cart, id_product: productId }
        });
        if (cartDetail) {
            cartDetail.quantitycart_detail += quantity;
            await cartDetail.save();
        } else {
            await CartDetail.create({
                id_cart: cart.id_cart,
                id_product: productId,
                quantitycart_detail: quantity
            });
        }
        if (wantsJSON(req)) return res.json({ success: true, message: 'Đã thêm vào giỏ hàng!' });
        res.redirect('/cart');
    } catch (error) {
        if (wantsJSON(req)) return res.status(500).json({ success: false, error: 'Lỗi hệ thống!' });
        res.status(500).send('Lỗi hệ thống!');
    }
},

    viewCart: async function (req, res) {
    // Ưu tiên session, nếu không có thì lấy từ query hoặc body
    const userId = req.session.user?.id_login || req.query.id_login || req.body.id_login;
    if (!userId) {
        if (wantsJSON(req)) return res.status(401).json({ cart: [], total: 0, error: 'Bạn cần đăng nhập!' });
        return res.redirect('/auth/login');
    }
    try {
        let cart = await Cart.findOne({ where: { id_login: userId } });
        let cartDetails = [];
        let total = 0;
        if (cart) {
            cartDetails = await CartDetail.findAll({
                where: { id_cart: cart.id_cart },
                include: [{ model: Product, as: 'product' }]
            });
            total = cartDetails.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantitycart_detail, 0);
        }
        const cartItems = cartDetails.map(item => ({
            productId: item.id_product,
            name: item.product?.name_product,
            price: item.product?.price,
            image: item.product?.image_product,
            quantity: item.quantitycart_detail
        }));
        if (wantsJSON(req)) return res.json({ cart: cartItems, total });
        res.render('customer/cart', { layout: 'home', cart: cartItems, total });
    } catch (error) {
        if (wantsJSON(req)) return res.status(500).json({ cart: [], total: 0 });
        res.status(500).send('Lỗi hệ thống!');
    }
},
    updateCart: async function (req, res) {
    const productId = parseInt(req.body.productId);
    const quantity = parseInt(req.body.quantity) || 0;
    const userId = req.session.user?.id_login || req.body.id_login || req.query.id_login;
    if (!userId) {
        if (wantsJSON(req)) return res.status(401).json({ success: false });
        return res.redirect('/auth/login');
    }
    try {
        let cart = await Cart.findOne({ where: { id_login: userId } });
        if (!cart) throw new Error('Không tìm thấy giỏ hàng');
        let cartDetail = await CartDetail.findOne({
            where: { id_cart: cart.id_cart, id_product: productId }
        });
        if (cartDetail) {
            if (quantity <= 0) {
                await cartDetail.destroy();
            } else {
                cartDetail.quantitycart_detail = quantity;
                await cartDetail.save();
            }
        }
        if (wantsJSON(req)) return res.json({ success: true });
        res.redirect('/cart');
    } catch (error) {
        if (wantsJSON(req)) return res.status(500).json({ success: false });
        res.status(500).send('Lỗi hệ thống!');
    }
},

    removeFromCart: async function (req, res) {
    const productId = parseInt(req.body.productId);
    const userId = req.session.user?.id_login || req.body.id_login || req.query.id_login;
    if (!userId) {
        if (wantsJSON(req)) return res.status(401).json({ success: false, error: 'Bạn cần đăng nhập!' });
        return res.redirect('/auth/login');
    }
    try {
        let cart = await Cart.findOne({ where: { id_login: userId } });
        if (!cart) {
            if (wantsJSON(req)) return res.status(404).json({ success: false, error: 'Không tìm thấy giỏ hàng' });
            return res.status(404).render('404', { message: 'Không tìm thấy giỏ hàng' });
        }
        await CartDetail.destroy({
            where: { id_cart: cart.id_cart, id_product: productId }
        });
        if (wantsJSON(req)) return res.json({ success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng!' });
        res.redirect('/cart');
    } catch (error) {
        if (wantsJSON(req)) return res.status(500).json({ success: false, error: 'Lỗi hệ thống!' });
        res.status(500).send('Lỗi hệ thống!');
    }
},

    placeOrder: function (req, res) {
        if (wantsJSON(req)) return res.json({ message: "Đi tới trang đặt hàng" });
        res.redirect('/order/create');
    }
};

module.exports = cartController;