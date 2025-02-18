const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

const Product = sequelize.define('Product', {
    id_product: {
        type: DataTypes.STRING(50),
        primaryKey: true
    },
    name_product: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    price: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    image_product: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    dimension: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    manufacturer: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    page: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    author: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    publisher: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    publisher_year: {
        type: DataTypes.INTEGER(4),
        allowNull: true
    },
    text_product: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    id_category: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'products',
    timestamps: false
});

module.exports = Product;