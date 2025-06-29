const Order = require('./order');
const OrderDetail = require('./order_detail');
const Product = require('./product');
const Cart = require('./cart');
const CartDetail = require('./cart_detail');

// Thiết lập mối quan hệ cho Order
Order.hasMany(OrderDetail, { foreignKey: 'id_order' });
OrderDetail.belongsTo(Order, { foreignKey: 'id_order' });

Product.hasMany(OrderDetail, { foreignKey: 'id_product', as: 'OrderDetails' });
OrderDetail.belongsTo(Product, { foreignKey: 'id_product', as: 'Product' });

// Thiết lập mối quan hệ cho Cart
Cart.hasMany(CartDetail, { foreignKey: 'id_cart' });
CartDetail.belongsTo(Cart, { foreignKey: 'id_cart' });

Product.hasMany(CartDetail, { foreignKey: 'id_product', as: 'CartDetails' });
CartDetail.belongsTo(Product, { foreignKey: 'id_product', as: 'product' });

module.exports = {
  Order,
  OrderDetail,
  Product,
  Cart,
  CartDetail
};