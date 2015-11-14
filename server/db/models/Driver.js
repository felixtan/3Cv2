'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Driver', { 
    payRate: {
      type: DataTypes.STRING,
      allowNull: true            
    },
    name: {
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
    organization: {
      type: DataTypes.STRING,
      allowNull: false            // required
    },

    // other entities
    GasCard: {
      type: DataTypes.STRING,
      allowNull: true
    },
    EzPass: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Car: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Logs: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true
    }
  });
};