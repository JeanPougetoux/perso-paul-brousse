'use strict';
module.exports = (sequelize, DataTypes) => {
    var SlideElement = sequelize.define('SlideElement', {
        name: { type: DataTypes.STRING, allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false },
    }, {
        paranoid: true,
        freezeTableName: true
    });
    return SlideElement;
};