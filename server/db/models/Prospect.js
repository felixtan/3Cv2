'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Prospect', { 

    organizationId: {
        type: DataTypes.STRING,
        allowNull: false
    },

    identifier: {
      type: DataTypes.STRING,
      allowNull: true
    },

    status: {
      type: DataTypes.JSONB,
      allowNull: false
    },

    data: {
      type: DataTypes.JSONB,
      allowNull: false
    }

  });
};