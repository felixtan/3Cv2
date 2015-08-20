'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('CarLog', {
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        dateInMs: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        tlcNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mileage: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
}
