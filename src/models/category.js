const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

class Category extends Model {}

Category.init({
    id_category: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_category: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { 
    sequelize, 
    modelName: 'category',
    timestamps: false 
});

module.exports = Category;