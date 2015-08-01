'use strict';

var models = require('../../db/models');
var sequelize = models.sequelize;
var PtgLogs = models.PtgLog;
var DriverLogs = models.DriverLog;
var Drivers = models.Driver;

module.exports = {
    getLogs: function(req, res) {
        PtgLogs.findAll({ order: '"dateInMs"', include: DriverLogs }).then(function(logs) {
            var minimizedData = logs;
            
            minimizedData.forEach(function(log) {
                delete log.dataValues.updatedAt;
                delete log.dataValues.createdAt;

                log.dataValues.DriverLogs.forEach(function(driverLog) {
                    delete driverLog.dataValues.updatedAt;
                    delete driverLog.dataValues.createdAt;
                    delete driverLog.dataValues.Ptg_DriverLogs;
                });
            });

            res.json(minimizedData);

        }).catch(function(err) {
            console.log(err);
            res.status(500).json({ error: err });
        });
    }
}