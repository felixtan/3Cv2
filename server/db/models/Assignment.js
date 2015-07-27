/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Assignment', { 
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
    }
  });
};
