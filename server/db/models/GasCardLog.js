'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('GasCardLog', {
        driverId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        driverName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        organization: {
            type: DataTypes.STRING,
            allowNull: false            // required
        }
    });
};