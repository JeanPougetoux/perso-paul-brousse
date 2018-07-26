'use strict';
module.exports = (sequelize, DataTypes) => {
    var PageLink = sequelize.define('PageLink', {
        link: { type: DataTypes.STRING, allowNull: false },
    }, {
        paranoid: true,
        freezeTableName: true
    });
    PageLink.associate = function(models) {
        PageLink.belongsTo(models.NavigationSubElement, { foreignKey: { allowNull: false }});
    };
    return PageLink;
};