'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('MaintenanceLog', {
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        dateInMs: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        organization: {
            type: DataTypes.STRING,
            allowNull: false            // required
        }
    });
}
