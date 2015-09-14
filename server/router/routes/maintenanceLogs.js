'use strict';

var models = require('../../db/models');
var sequelize = models.sequelize;
var MaintenanceLogs = models.MaintenanceLog;
var CarLogs = models.CarLog;
var Cars = models.Car;
var getUserId = require('../helpers').getUserId;

module.exports = {
    getLogs: function(req, res) {
        MaintenanceLogs.findAll({ 
            where: {
                organization: getUserId(req)
            },
            order: '"dateInMs"', 
            include: [{
                model: CarLogs,
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
                
                log.dataValues.CarLogs.forEach(function(carLog) {
                    delete carLog.dataValues.updatedAt;
                    delete carLog.dataValues.createdAt;
                    delete carLog.dataValues.Maintenance_CarLogs;
                });

            });

            return minimizedData;

        }).then(function(data) {

            var finalData = data;

            MaintenanceLogs.max('dateInMs').then(function(mostRecentDateInMs) {
                finalData.mostRecentDateInMs = mostRecentDateInMs;
                res.json(finalData);
            });

        });
    },

    createLogs: function(req, res) {
        MaintenanceLogs.create({
            date: req.body.date,
            dateInMs: req.body.dateInMs,
            organization: getUserId(req)
        }).then(function(maintenanceLog) {
            Cars.findAll({
                where: {
                    organization: getUserId(req)
                }
            }).then(function(cars) {
                cars.forEach(function(car) {
                    CarLogs.create({
                        dateInMs: req.body.dateInMs,
                        date: req.body.date,
                        tlcNumber: car.tlcNumber,
                        organization: getUserId(req)
                    }).then(function(carLog) {
                        car.addMaintenanceLog([carLog.id]);
                        maintenanceLog.addCarLog([carLog.id]);
                    });
                });
            })
            .then(function() {
                res.json(maintenanceLog);
            }).catch(function(err) {
                console.error(err);
            });   
        });
    }
}