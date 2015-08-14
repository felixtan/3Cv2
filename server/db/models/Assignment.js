/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Assignment', { 
    status: {
      type: DataTypes.ENUM('active','inactive'),
      allowNull: true,
      defaultValue: 'active'
    }
  });
};
