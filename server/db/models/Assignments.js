/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Assignments', { 
    driverName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tlcNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active','inactive'),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    carId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    driverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });
};
