'use strict';

var models = require('../../db/models');
var sequelize = models.sequelize;
var PtgLogs = models.PtgLog;
var CarLogs = models.CarLog;
var Cars = models.Car;

module.exports = {
    getLogs: function(req, res) {
        PtgLogs.findAll({ order: '"dateInMs"', include: CarLogs }).then(function(logs) {
            
            var minimizedData = {};
            minimizedData.logs = logs;

            minimizedData.logs.forEach(function(log) {
                
                delete log.dataValues.updatedAt;
                delete log.dataValues.createdAt;

                log.dataValues.CarLogs.forEach(function(carLog) {
                    delete carLog.dataValues.updatedAt;
                    delete carLog.dataValues.createdAt;
                    delete carLog.dataValues.Ptg_CarLogs;
                });

            });

            return minimizedData;

        }).then(function(data) {

            var finalData = data;

            PtgLogs.max('dateInMs').then(function(mostRecentDataInMs) {
                finalData.mostRecentDataInMs = mostRecentDataInMs;
                res.json(finalData);
            });

        });
    },

    createLogs: function(req, res) {
        PtgLogs.create({
            date: req.body.date,
            dateInMs: req.body.dateInMs
        }).then(function(ptgLog) {
            Car.findAll().then(function(cars) {
                cars.forEach(function(car) {
                    CarLogs.create({
                        dateInMs: req.body.dateInMs,
                        date: req.body.date,
                        tlcNumber: car.tlcNumber
                    }).then(function(carLog) {
                        car.addMaintenanceLog([carLog.id]);
                        ptgLog.addCarLog([carLog.id]);
                    });
                });
            })
            .then(function() {
                res.json(ptgLog);
            }).catch(function(err) {
                console.error(err);
            });
        });
    }
}