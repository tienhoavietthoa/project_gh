const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

const Order = sequelize.define('Order', {
    id_order: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_order: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_order: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address_order: {
        type: DataTypes.STRING,
        allowNull: false
    },
    payment: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_order: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    id_login: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    payment_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending' // pending, paid, failed, cancelled
    }
}, {
    tableName: 'orders',
    timestamps: false
});

module.exports = Order;