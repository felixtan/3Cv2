'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('EzPass', {

        data: {
            type: DataTypes.JSONB,
            allowNull: false
        }

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