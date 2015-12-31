'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Car', {

    organizationId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    data: {
      type: DataTypes.JSONB,
      allowNull: false
    },

    logs: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true
    },

    driversAssigned: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true
    }
  });
};
