const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

const Information = sequelize.define('Information', {
    id_information: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_information: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    phone_information: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true
    },
    id_login: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    tableName: 'informations',
    timestamps: false
});

module.exports = Information;