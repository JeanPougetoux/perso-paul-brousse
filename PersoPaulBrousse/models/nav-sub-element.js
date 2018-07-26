'use strict';
module.exports = (sequelize, DataTypes) => {
    var NavigationSubElement = sequelize.define('NavigationSubElement', {
        title: { type: DataTypes.STRING, allowNull: false },
        order: { type: DataTypes.INTEGER, allowNull: false, unique: 'order' },
        type: {type: DataTypes.STRING(10), allowNull: false, defaultValue: "CONTENT" }
    }, {
        paranoid: true,
        freezeTableName: true
    });
    NavigationSubElement.associate = function(models) {
        NavigationSubElement.belongsTo(models.NavigationElement, { foreignKey: { allowNull: false, unique: 'order' }});
        NavigationSubElement.hasMany(models.PageContent, { foreignKey: { allowNull: false }});
        NavigationSubElement.hasOne(models.PageLink, { foreignKey: { allowNull: false }});
        NavigationSubElement.hasOne(models.PageList, { foreignKey: { allowNull: false }});
    };
    return NavigationSubElement;
};