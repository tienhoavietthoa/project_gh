const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

const OrderDetail = sequelize.define('OrderDetail', {
    id_detail: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_order: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_product: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity_detail: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price_detail: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'order_details',
    timestamps: false
});

module.exports = OrderDetail;