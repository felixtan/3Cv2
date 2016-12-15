'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Asset', {

        organizationId: {
            type: DataTypes.STRING,
            allowNull: false
        },  

        identifier: {      // alias: type or name (of asset)
            type: DataTypes.STRING,
            allowNull: false
        },

        assetType: {
            type: DataTypes.STRING,
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