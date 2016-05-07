'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Car', {

    organizationId: {
        type: DataTypes.STRING,
        allowNull: false
    },

    identifier: {
      type: DataTypes.STRING,
      allowNull: false
    },
    
    data: {
      type: DataTypes.JSONB,
      allowNull: false
    },

    logs: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: false
    },

    driversAssigned: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: false
    }
  });
};
