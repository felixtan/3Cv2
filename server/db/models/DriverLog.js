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
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tollCosts: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        gasCosts: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        deposit: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        hours: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        acceptRate: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        payout: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        debt: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        profitContributed: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    });
};