const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

class Contact extends Model {}

Contact.init({
    id_contact: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_contact: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_contact: {
        type: DataTypes.STRING,
        allowNull: false
    },
    text_contact: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date_contact: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    id_login: {
        type: DataTypes.INTEGER,
        allowNull: true // Có thể null như trong ảnh
    }
}, {
    sequelize,
    modelName: 'contact',
    timestamps: false
});

module.exports = Contact;