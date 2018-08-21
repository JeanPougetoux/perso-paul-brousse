'use strict';
module.exports = (sequelize, DataTypes) => {
    var Visits = sequelize.define('Visits', {
        name: { type: DataTypes.STRING, allowNull: false },
        number: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    }, {
        paranoid: true,
        freezeTableName: true
    });
    return Visits;
};