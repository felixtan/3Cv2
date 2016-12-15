'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('ProspectStatuses', {

        organizationId: {
            type: DataTypes.STRING,
            allowNull: false
        },

        data: {
            type: DataTypes.JSONB,
            allowNull: false
        },

        statuses: {
            type: DataTypes.ARRAY(DataTypes.JSONB),
            allowNull: false
        }

    });
}
