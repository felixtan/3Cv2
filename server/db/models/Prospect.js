'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Prospect', { 
    status: {
      type: DataTypes.ENUM('callers', 'interviewed', 'waiting list', 'rejected'),
      allowNull: true,
      defaultValue: 'callers'
    },
    givenName: {
      type: DataTypes.STRING,
      allowNull: true          
    },
    middleInitial: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    surName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    driversLicenseNum: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tlc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dmv: {
      type: DataTypes.STRING,
      allowNull: true
    },
    points: {
      type: DataTypes.STRING,
      allowNull: true
    },
    accidents: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shift: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paperwork: {
      type: DataTypes.STRING,
      allowNull: true
    },
    organization: {
      type: DataTypes.STRING,
      allowNull: false          // required
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });
};