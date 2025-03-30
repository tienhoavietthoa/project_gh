const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

const Contact = sequelize.define('Contact', {
    id_contact: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_contact: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    phone_contact: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    text_contact: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    date_contact: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'contacts',
    timestamps: false
});

module.exports = Contact;