'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Driver', { 
    payRate: {
      type: DataTypes.STRING,
      allowNull: false            // required
    },
    givenName: {
      type: DataTypes.STRING,
      allowNull: false            // required
    },
    middleInitial: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    surName: {
      type: DataTypes.STRING,
      allowNull: false            // required
    },
    organization: {
      type: DataTypes.STRING,
      allowNull: false            // required
    }
  });
};