'use strict';

var models = require('../../db/models');
var Cars = models.Car;
var getUserId = require('../helpers').getUserId;
var CarLogs = models.CarLog;
var MaintenanceLogs = models.MaintenanceLog;

module.exports = {

    getCars: function(req, res) {
        getUserId(req).then(function(organizationId) {
            Cars.findAll({
                where: { organization: organizationId }
            }).then(function(cars) {
                res.json(cars);
            }).catch(function(err) {
                console.error(err);
            });
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    getCar: function(req, res) {
        Cars.findById(req.params.id).then(function(car) {
            if(!car) {
                res.status(404).json({ error: 'Resource not found.' });
                console.log('Car not found.');
            } else {
                res.json(car);
            }
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    save: function(req, res) {
        getUserId(req).then(function(organizationId) {
            Cars.create({
                tlcNumber: req.body.tlcNumber,
                licensePlateNumber: req.body.licensePlateNumber,
                mileage: req.body.mileage,
                organization: organizationId,
                description: req.body.description
            }).then(function(car) {
                /**
                 * If driverId is given, then associate the new car with the driver.
                 */
                if(req.body.driverId !== null && typeof req.body.driverId !== 'undefined') {
                    car.addDriver([req.body.driverId]).then(function() {
                        console.log('Car ' + car.id + ' is associated with Driver ' + req.body.driverId);
                    })
                }

                /**
                 * Create car logs.
                 */
                MaintenanceLogs.findAll({
                    where: { organization: organizationId}
                }).then(function(maintenanceLogs) {
                    maintenanceLogs.forEach(function(maintenanceLog) {
                        CarLogs.create({
                            date: maintenanceLog.date,
                            dateInMs: maintenanceLog.dateInMs,
                            organization: organizationId,
                            tlcNumber: car.tlcNumber
                        }).then(function(carLog) {
                            car.addLog([carLog.id]);
                            maintenanceLog.addCarLog([carLog.id]);
                        });
                    });
                }).then(function() {
                    res.json(car);
                }).catch(function(err) {
                    console.error(err);
                });
            }).catch(function(err) {
                console.error(err);
            });
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    updateCar: function(req, res) {
        Cars.update({
            tlcNumber: req.body.tlcNumber,
            licensePlateNumber: req.body.licensePlateNumber,
            mileage: req.body.mileage,
            oilChangeRequired: req.body.oilChangeRequired,
            description: req.body.description
        }, {
            where: {
                id: req.params.id,
            }
        })
        .then(function() {
            res.status(200).json({ msg: 'Update car where id = ' + req.params.id });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    deleteCar: function(req, res) {
        Cars.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(function() {
            res.status(200).json({ msg: 'Deleted car where id = ' + req.params.id });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    rearrange: function(req, res) {
        getUserId(req).then(function(organizationId) {
            Cars.findAll({
                where: { organization: organizationId }
            }).then(function(cars) {
                console.log('before rearrange:', cars);
                console.log('oldIndex:', req.body.oldIndex - 1);
                console.log('newIndex:', req.body.newIndex - 1);
                cars.splice(req.body.newIndex - 1, 0, cars.splice(req.body.oldIndex - 1, 1)[0]);
                return cars;
            }).then(function(cars) {
                console.log('after rearrange:',cars);
                Cars.update(cars);
            }).catch(function(err) {
                console.error(err);
            });
        });
    }
};