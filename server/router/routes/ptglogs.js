'use strict';

var models = require('../../db/models');
var sequelize = models.sequelize;
var PtgLogs = models.PtgLog;
var DriverLogs = models.DriverLog;
var Drivers = models.Driver;

module.exports = {
    getLogs: function(req, res) {
        PtgLogs.findAll({ order: '"dateInMs"', include: DriverLogs }).then(function(logs) {

            var minimizedData = {};
            minimizedData.logs = logs;
            
            minimizedData.logs.forEach(function(log) {

                delete log.dataValues.updatedAt;
                delete log.dataValues.createdAt;

                log.dataValues.DriverLogs.forEach(function(driverLog) {
                    delete driverLog.dataValues.updatedAt;
                    delete driverLog.dataValues.createdAt;
                    delete driverLog.dataValues.Ptg_DriverLogs;
                });

            });
            
            return minimizedData;

        }).then(function(data) {
            
            var finalData = data;

            PtgLogs.max("dateInMs").then(function(mostRecentDateInMs) {
                finalData.mostRecentDateInMs = mostRecentDateInMs;
                res.json(data);
            });
        });
    },

    createLog: function(req, res) {
        PtgLogs.create({
            dateInMs: req.body.dateInMs,
            date: req.body.date
        }).then(function(ptgLog) {
            Drivers.findAll().then(function(drivers) {
                drivers.forEach(function(driver) {
                    DriverLogs.create({
                        date: ptgLog.date,
                        dateInMs: ptgLog.dateInMs,
                        givenName: driver.givenName,
                        surName: driver.surName
                    }).then(function(driverLog) {
                        driver.addLog([driverLog.id]);
                        ptgLog.addDriverLog([driverLog.id]);
                    });
                });
            }).then(function() {
                res.json(ptgLog);
            }).catch(function(err) {
                console.error(err);
            });
        });
    }
}