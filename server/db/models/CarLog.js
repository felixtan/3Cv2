'use strict';

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('CarLog', {

        data: {
            type: DataTypes.JSONB,
            allowNull: false
        }

        // carId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: true
        // },
        // date: {
        //     type: DataTypes.DATE,
        //     allowNull: true
        // },
        // dateInMs: {
        //     type: DataTypes.BIGINT,
        //     allowNull: true
        // },
        // licensePlate: {
        //     type: DataTypes.STRING,
        //     allowNull: false            // required
        // },
        // mileage: {
        //     type: DataTypes.INTEGER,
        //     allowNull: true
        // },
        // note: {
        //     type: DataTypes.STRING,
        //     allowNull: true
        // },
        // organization: {
        //     type: DataTypes.STRING,
        //     allowNull: false            // required
        // }
    });
}
