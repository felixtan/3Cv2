'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('DriverLog', {
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        dateInMs: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        givenName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        surName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        uberRevenue: {
            type: DataTypes.FLOAT(2),
            allowNull: true
        },
        tollCosts: {
            type: DataTypes.FLOAT(2),
            allowNull: true
        },
        gasCosts: {
            type: DataTypes.FLOAT(2),
            allowNull: true
        },
        deposit: {
            type: DataTypes.FLOAT(2),
            allowNull: true
        },
        hours: {
            type: DataTypes.FLOAT(1),
            allowNull: true
        },
        acceptRate: {
            type: DataTypes.FLOAT(1),
            allowNull: true
        },
        payout: {
            type: DataTypes.FLOAT(2),
            allowNull: true
        },
        debt: {
            type: DataTypes.FLOAT(2),
            allowNull: true
        },
        profitContributed: {
            type: DataTypes.FLOAT(2),
            allowNull: true
        }
    });
};