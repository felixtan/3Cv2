'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('PtgLog', {
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
            allowNull: false
        }
    });
}
