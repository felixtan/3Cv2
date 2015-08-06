'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('DriverAssets', {
        // works when using belongsToMany, solves the EzPassId null problem
        // id: {
        //     type: DataTypes.INTEGER,
        //     primaryKey: true,
        //     autoIncrement: true
        // },
        DriverId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        GasCardId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        EzPassId: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
};