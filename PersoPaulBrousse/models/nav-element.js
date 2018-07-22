'use strict';
module.exports = (sequelize, DataTypes) => {
    var NavigationElement = sequelize.define('NavigationElement', {
        title: { type: DataTypes.STRING, allowNull: false },
        order: { type: DataTypes.INTEGER, allowNull: false, unique: true }
    }, {
        paranoid: true,
        freezeTableName: true
    });
    NavigationElement.associate = function(models) {
        NavigationElement.hasMany(models.NavigationSubElement, { foreignKey: { allowNull: false }});
    };
    return NavigationElement;
};