'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Car', { 
    organizationId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false
    }
    
  });
};
