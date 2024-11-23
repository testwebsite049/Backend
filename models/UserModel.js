// userModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cb_delete: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
});

module.exports = User;
