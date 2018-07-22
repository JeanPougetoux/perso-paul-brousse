'use strict';
module.exports = (sequelize, DataTypes) => {
    var PageContent = sequelize.define('PageContent', {
        content: { type: DataTypes.TEXT, allowNull: false },
        type: { type: DataTypes.STRING(10), allowNull: false, defaultValue: "HTML" },
        order: { type: DataTypes.INTEGER, allowNull: false, unique: 'order' }
    }, {
        paranoid: true,
        freezeTableName: true
    });
    PageContent.associate = function(models) {
        PageContent.belongsTo(models.NavigationSubElement, { foreignKey: { allowNull: false, unique: 'order' }});
    };
    return PageContent;
};