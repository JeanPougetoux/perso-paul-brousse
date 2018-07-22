'use strict';
module.exports = (sequelize, DataTypes) => {
    var Administrator = sequelize.define('Administrator', {
        login: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false }
    }, {
        paranoid: true,
        freezeTableName: true
    });
    return Administrator;
};