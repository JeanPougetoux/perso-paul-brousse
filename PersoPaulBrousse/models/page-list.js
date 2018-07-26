'use strict';
module.exports = (sequelize, DataTypes) => {
    var PageList = sequelize.define('PageList', {
        title: { type: DataTypes.STRING, allowNull: false },
    }, {
        paranoid: true,
        freezeTableName: true
    });
    PageList.associate = function(models) {
        PageList.belongsTo(models.NavigationSubElement, { foreignKey: { allowNull: false }});
    };
    return PageList;
};