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
    
    // licenseNumber: {
    //   type: DataTypes.STRING,
    //   allowNull: true,           // required
    // },
    // licensePlate: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // mileage: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,           // required
    // },
    // oilChangeRequired: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: true,
    //   defaultValue: false,
    // },
    // organization: {
    //   type: DataTypes.STRING,
    //   allowNull: false,           // required
    // },
    // description: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    // }
  });
};
