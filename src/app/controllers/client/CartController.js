const Product = require('../../../models/product');

const cartController = {
    addToCart: async function (req, res) {
        const productId = req.body.productId;
        const quantity = parseInt(req.body.quantity) || 1;

        // Kiểm tra xem giỏ hàng đã tồn tại trong session chưa, nếu chưa thì khởi tạo
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Tìm sản phẩm trong giỏ hàng
        const cartItem = req.session.cart.find(item => item.productId === productId);

        if (cartItem) {
            // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
            cartItem.quantity += quantity;
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
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
        }

        res.redirect('/cart');
    },

    viewCart: function (req, res) {
        res.render('cart', { layout: 'main', cart: req.session.cart || [] });
    },

    updateCart: function (req, res) {
        const productId = req.body.productId;
        const quantity = parseInt(req.body.quantity) || 1;

        if (req.session.cart) {
            const cartItem = req.session.cart.find(item => item.productId === productId);
            if (cartItem) {
                cartItem.quantity = quantity;
            }
        }

        res.redirect('/cart');
    },

    removeFromCart: function (req, res) {
        const productId = req.body.productId;

        if (req.session.cart) {
            req.session.cart = req.session.cart.filter(item => item.productId !== productId);
        }

        res.redirect('/cart');
    }
};

module.exports = cartController;