const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

const Login = sequelize.define('Login', {
    id_login: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_login: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    pass: {
        type: DataTypes.STRING(2000),
        allowNull: false
    },
    date_login: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_level: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_information: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'logins',
    timestamps: false
});

module.exports = Login;