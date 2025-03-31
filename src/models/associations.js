// src/models/associations.js
const Order = require('./order');
const OrderDetail = require('./order_detail');
const Product = require('./product');

// Thiết lập mối quan hệ
Order.hasMany(OrderDetail, { foreignKey: 'id_order' });
OrderDetail.belongsTo(Order, { foreignKey: 'id_order' });

Product.hasMany(OrderDetail, { foreignKey: 'id_product', as: 'OrderDetails' });
OrderDetail.belongsTo(Product, { foreignKey: 'id_product', as: 'Product' });

module.exports = {
  Order,
  OrderDetail,
  Product
};