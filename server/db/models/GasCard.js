'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('GasCard', {

        data: {
            type: DataTypes.JSONB,
            allowNull: false
        }

        // name: {
        //     type: DataTypes.STRING,
        //     allowNull: true
        // },
        // number: {
        //     type: DataTypes.STRING,
        //     allowNull: false            // required
        // },
        // organization: {
        //     type: DataTypes.STRING,
        //     allowNull: false            // required
        // }
    });
};