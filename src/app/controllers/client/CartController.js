const Product = require('../../../models/product');

const cartController = {
    addToCart: async function (req, res) {
        const productId = parseInt(req.body.productId);
        const quantity = parseInt(req.body.quantity) || 1;

        if (!req.session.cart) {
            req.session.cart = [];
        }

        let cartItemIndex = req.session.cart.findIndex(item => item.productId === productId);
        if (cartItemIndex !== -1) {
            req.session.cart[cartItemIndex].quantity += quantity;
        } else {
            try {
                const product = await Product.findByPk(productId);
                if (product) {
                    req.session.cart.push({
                        productId: product.id_product,
                        name: product.name_product,
                        price: product.price,
                        image: product.image_product,
                        quantity: quantity
                    });
                }
            } catch (error) {
                console.error('❌ Lỗi khi lấy sản phẩm từ DB:', error);
                return res.status(500).send('Lỗi hệ thống!');
            }
        }

        req.session.save(err => {
            if (err) {
                console.error('❌ Lỗi khi lưu session:', err);
            }
            console.log('✅ Giỏ hàng sau khi thêm:', req.session.cart);
            res.redirect('/cart');
        });
    },

    viewCart: function (req, res) {
        console.log("👉 Giỏ hàng hiện tại (trước khi render):", req.session.cart);
        const total = req.session.cart ? req.session.cart.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;
        res.render('customer/cart', { layout: 'home', cart: req.session.cart || [], total });
    },

    updateCart: function (req, res) {
        const productId = parseInt(req.body.productId);
        const quantity = parseInt(req.body.quantity) || 0;

        if (req.session.cart) {
            let cartItemIndex = req.session.cart.findIndex(item => item.productId === productId);
            if (cartItemIndex !== -1) {
                if (quantity <= 0) {
                    req.session.cart.splice(cartItemIndex, 1);
                } else {
                    req.session.cart[cartItemIndex].quantity = quantity;
                }
            }
        }

        if (req.session.cart && req.session.cart.length === 0) {
            delete req.session.cart;
        }

        req.session.save(err => {
            if (err) {
                console.error('❌ Lỗi khi cập nhật session:', err);
            }
            console.log('✅ Giỏ hàng sau khi cập nhật:', req.session.cart);
            res.redirect('/cart');
        });
    },

    removeFromCart: function (req, res) {
        const productId = parseInt(req.body.productId);

        if (req.session.cart) {
            req.session.cart = req.session.cart.filter(item => item.productId !== productId);

            if (req.session.cart.length === 0) {
                delete req.session.cart;
            }
        }

        req.session.save(err => {
            if (err) {
                console.error('❌ Lỗi khi xóa sản phẩm khỏi giỏ hàng:', err);
            }
            console.log('✅ Giỏ hàng sau khi xóa:', req.session.cart);
            res.redirect('/cart');
        });
    },

    placeOrder: function (req, res) {
        res.redirect('/order/create');
    }
};

module.exports = cartController;