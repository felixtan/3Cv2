'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Car', { 
    tlcNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    licensePlateNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mileage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    oilChangeRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  });
};