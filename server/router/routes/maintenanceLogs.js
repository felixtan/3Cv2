'use strict';

var models = require('../../db/models');
var sequelize = models.sequelize;
var MaintenanceLogs = models.MaintenanceLog;
var CarLogs = models.CarLog;
var Cars = models.Car;
var getUserId = require('../helpers').getUserId;

module.exports = {
    getLogs: function(req, res) {
        getUserId(req).then(function(organizationId) {
            MaintenanceLogs.findAll({ 
                where: { organization: organizationId },
                order: '"dateInMs"', 
                include: [{
                    model: CarLogs,
                    where: { organization: organizationId },
                    required: false
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
        });
    },

    createLogs: function(req, res) {
        getUserId(req).then(function(organizationId) {
            MaintenanceLogs.create({
                date: req.body.date,
                dateInMs: req.body.dateInMs,
                organization: organizationId
            }).then(function(maintenanceLog) {
                Cars.findAll({
                    where: { organization: organizationId }
                }).then(function(cars) {
                    cars.forEach(function(car) {
                        CarLogs.create({
                            dateInMs: req.body.dateInMs,
                            date: req.body.date,
                            mileage: car.mileage,
                            licensePlate: car.licensePlate,
                            organization: organizationId,
                            carId: car.id
                        }).then(function(carLog) {
                            car.addLog([carLog.id]);
                            maintenanceLog.addCarLog([carLog.id]);
                            console.log('Log for car ' + car.id + ' attached to maintenance log ' + maintenanceLog.date);
                        });
                    });
                })
                .then(function() {
                    res.json(maintenanceLog);
                }).catch(function(err) {
                    console.error(err);
                });   
            });    
        }).catch(function(err) {
            res.status(500).json({ error: err });
        });
    }
}