'use strict';

var models = require('../../db/models');
var sequelize = models.sequelize;
var PtgLogs = models.PtgLog;
var DriverLogs = models.DriverLog;
var Drivers = models.Driver;
var getUserId = require('../helpers').getUserId;

module.exports = {
    getLogs: function(req, res) {
        PtgLogs.findAll({ 
            where: {
                organization: getUserId(req)
            },
            order: '"dateInMs"', 
            include: [{
                model: DriverLogs,
                where: {
                    organization: getUserId(req)
                }
            }]
        }).then(function(logs) {

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
                res.json(finalData);
            });
        });
    },

    createLog: function(req, res) {
        PtgLogs.create({
            dateInMs: req.body.dateInMs,
            date: req.body.date,
            organization: getUserId(req)
        }).then(function(ptgLog) {
            Drivers.findAll({
                where: {
                   organization: getUserId(req)
                }
            }).then(function(drivers) {
                drivers.forEach(function(driver) {
                    DriverLogs.create({
                        date: ptgLog.date,
                        dateInMs: ptgLog.dateInMs,
                        givenName: driver.givenName,
                        surName: driver.surName,
                        organization: getUserId(req)
                    }).then(function(driverLog) {
                        driver.addPtgLog([driverLog.id]);
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