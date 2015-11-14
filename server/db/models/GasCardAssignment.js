/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('GasCardAssignment', { 

    data: {
      type: DataTypes.JSONB,
      allowNull: false
    }
    
    // status: {
    //   type: DataTypes.ENUM('active','inactive'),
    //   allowNull: true,
    //   defaultValue: 'active'
    // },
    // DriverId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: true
    // },
    // GasCardId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: true
    // }
  });
};
