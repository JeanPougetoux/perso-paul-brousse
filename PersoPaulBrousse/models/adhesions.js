'use strict';
module.exports = (sequelize, DataTypes) => {
    var Adhesions = sequelize.define('Adhesions', {
        firstname: { type: DataTypes.STRING, allowNull: false },
        lastname: { type: DataTypes.STRING, allowNull: false },
        service: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        telephone: { type: DataTypes.STRING, allowNull: false },
    }, {
        paranoid: true,
        freezeTableName: true
    });
    return Adhesions;
};