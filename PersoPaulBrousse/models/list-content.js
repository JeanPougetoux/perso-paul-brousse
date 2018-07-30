'use strict';
module.exports = (sequelize, DataTypes) => {
    var ListContent = sequelize.define('ListContent', {
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        firstLines: { type: DataTypes.TEXT, allowNull: true },
        illustration: { type: DataTypes.STRING, allowNull: true },
        type: {type: DataTypes.STRING(10), allowNull: false, defaultValue: "CONTENT" }
    }, {
        paranoid: true,
        freezeTableName: true
    });
    PageListElement.associate = function(models) {
        PageListElement.belongsTo(models.NavigationSubElement, { foreignKey: { allowNull: false }});
    };
    return PageListElement;
};