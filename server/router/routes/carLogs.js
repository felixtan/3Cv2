'use strict';

var models = require('../../db/models');
var CarLog = models.CarLog;
var Car = models.Car;
var helpers = require('../helpers');

module.exports = {
    getForAllCars: function(req, res) {
        Car.findAll({ 
            where: helpers.filterByOrgId(req),
        }).then(function(cars) {
            res.json(cars);
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    getForOneCar: function(req, res) {
        Car.findById(req.params.id).then(function(car) {
            res.json(car.logs);
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    create: function(req, res) {
        CarLogs.create({
            date: req.body.date,
            dateInMs: req.body.dateInMs,
            licensePlate: req.body.licensePlate,
            note: req.body.note,
            organization: organizationId,
            carId: req.body.carId
        }).then(function(log) {
            Cars.findById(req.params.id).then(function(car) {
                car.addLog([log.id]).then(function() {
                    console.log('Car ' + car.id + ' has new log.');
                    res.json(log);
                });
            });
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });  
    },

    update: function(req, res) {
        CarLogs.findById(req.params.id).then(function(carLog) {
            console.log('carLog.carId:',carLog.carId);
            CarLogs.max("mileage", { where: { carId: carLog.carId } }).then(function(previouslyCheckedMileage) {
                // check if car needs oil change
                // TODO: user should be able to set thresholdMileage
                var thresholdMileage = 10000;
                var oilChangeRequired = (req.body.mileage - previouslyCheckedMileage >= thresholdMileage) || false;
                console.log('previouslyCheckedMileage:', previouslyCheckedMileage);
                console.log('oilChangeRequired:', oilChangeRequired);
                if(oilChangeRequired) {
                    Cars.findById(carLog.carId).then(function(car) {
                        car.update({
                            oilChangeRequired: true
                        });
                    }).catch(function(err) {
                        console.error(err);
                    });
                }

                carLog.update({
                    mileage: req.body.mileage,
                    note: req.body.note
                }).then(function() {
                    res.status(200).json({ msg: 'Updated log for car ' + req.params.id }); 
                }).catch(function(err) {
                    console.error(err);    
                });
            });
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    delete: function(req, res) {
        CarLogs.destroy({
            where: {
                carId: req.params.id,
                id: req.body.carLogId
            }
        })
        .then(function() {
            res.status(200).json({ msg: 'Deleted car log.' });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    }
}