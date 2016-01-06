'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Asset', {

        organizationId: {
            type: DataTypes.STRING,
            allowNull: false
        },  

        indentifier: {      // alias: type or name (of asset)
            type: DataTypes.JSONB,
            allowNull: false
        },

        data: {
            type: DataTypes.JSONB,
            allowNull: false
        },

        logs: {
            type: DataTypes.ARRAY(DataTypes.JSONB),
            allowNull: false
        },

        driversAssigned: {
            type: DataTypes.ARRAY(DataTypes.JSONB),
            allowNull: false
        }
    });
};