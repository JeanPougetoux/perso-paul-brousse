'use strict';
module.exports = (sequelize, DataTypes) => {
    var Subscribers = sequelize.define('Subscribers', {
        mail: { type: DataTypes.STRING, allowNull: false },
    }, {
        paranoid: true,
        freezeTableName: true
    });
    return Subscribers;
};