'use strict';

var models = require('../../db/models');
var sequelize = models.sequelize;
var PtgLogs = models.PtgLog;
var DriverLogs = models.DriverLog;
var Drivers = models.Driver;
var getUserId = require('../helpers').getUserId;

module.exports = {
    getLogs: function(req, res) {
        getUserId(req).then(function(organizationId) {
            PtgLogs.findAll({ 
                where: { organization: organizationId },
                order: '"dateInMs"', 
                include: [{
                    model: DriverLogs,
                    where: { organization: organizationId },
                    required: false
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
        });
    },

    createLog: function(req, res) {
        getUserId(req).then(function(organizationId) {
            PtgLogs.create({
                dateInMs: req.body.dateInMs,
                date: req.body.date,
                organization: organizationId
            }).then(function(ptgLog) {
                Drivers.findAll({
                    where: { organization: organizationId }
                }).then(function(drivers) {
                    drivers.forEach(function(driver) {
                        DriverLogs.create({
                            date: ptgLog.date,
                            dateInMs: ptgLog.dateInMs,
                            givenName: driver.givenName,
                            driverId: driver.id,
                            surName: driver.surName,
                            organization: organizationId
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
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    }
}