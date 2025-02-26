const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

class Product extends Model {}

Product.init({
    id_product: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_product: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    image_product: {
        type: DataTypes.STRING,
        allowNull: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dimension: {
        type: DataTypes.STRING,
        allowNull: true
    },
    manufacturer: {
        type: DataTypes.STRING,
        allowNull: true
    },
    page: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    author: {
        type: DataTypes.STRING,
        allowNull: true
    },
    publisher: {
        type: DataTypes.STRING,
        allowNull: true
    },
    publisher_year: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    text_product: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    id_category: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id_category'
        }
    }
}, { 
    sequelize, 
    modelName: 'product',
    timestamps: false // Tắt tự động tạo các cột createdAt và updatedAt
});

module.exports = Product;