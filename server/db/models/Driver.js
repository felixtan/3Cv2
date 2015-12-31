'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Driver', {

    organizationId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    identifier: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
    data: {
      type: DataTypes.JSONB,
      allowNull: false
    },

    logs: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true
    },

    carsAssigned: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true
    }
    
  });
};