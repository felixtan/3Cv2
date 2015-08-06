'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('GasCard', {
        number: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};