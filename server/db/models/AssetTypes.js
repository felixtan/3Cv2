'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('AssetTypes', {

        organizationId: {
            type: DataTypes.STRING,
            allowNull: false
        },

        data: {
            type: DataTypes.JSONB,
            allowNull: false
        },

        types: {
            type: DataTypes.ARRAY(DataTypes.JSONB),
            allowNull: false
        }

    });
}
