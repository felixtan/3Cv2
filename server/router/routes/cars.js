'use strict';

var models = require('../../db/models');
var helpers = require('../helpers');
var Cars = models.Car;
var getUserId = helpers.getUserId;
var CarLogs = models.CarLog;
var MaintenanceLogs = models.MaintenanceLog;

module.exports = {

    get: function(req, res) {
        // getUserId(req).then(function(organizationId) {
            Cars.findAll({
                where: helpers.filterByOrgId(req)
            }).then(function(cars) {
                res.json(cars);
            }).catch(function(err) {
                console.error(err);
                res.status(500).json({ error: err });
            });
        // }).catch(function(err) {
        //     console.error(err);
        //     res.status(500).json({ error: err });
        // });
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

    getModel: function(req, res) {
        Cars.findAll({
            where: helpers.filterByOrgId,
            limit: 1
        }).then(function(cars) {
            // use underscore to just return the keys
            console.log(cars[0].dataValues);
            res.json(helpers.getKeys(cars[0].dataValues.data));
        }).catch(function(err) {
            res.status(500).json({ error: err });
        });
    },

    create: function(req, res) {
        // getUserId(req).then(function(organizationId) {
            Cars.create({
                organizationId: helpers.getOrgId,
                data: req.body.data
            }).then(function(car) {
                /**
                 * If driverId is given, then associate the new car with the driver.
                 */
                // if(req.body.data.driverId !== null && typeof req.body.data.driverId !== 'undefined') {
                    // car.addDriver([req.body.driverId]).then(function() {
                    //     console.log('Car ' + car.id + ' is associated with Driver ' + req.body.driverId);
                    // })
                    // console.log('Assign car' + req.body.id + ' to driver ' + req.body.data.driverId + '!');
                // }

                /**
                 * Create car logs.
                 */
                // MaintenanceLogs.findAll({
                //     where: { organization: organizationId}
                // }).then(function(maintenanceLogs) {
                //     maintenanceLogs.forEach(function(maintenanceLog) {
                //         CarLogs.create({
                //             date: maintenanceLog.date,
                //             dateInMs: maintenanceLog.dateInMs,
                //             organization: organizationId,
                //             licensePlate: car.licensePlate,
                //             mileage: car.mileage
                //         }).then(function(carLog) {
                //             car.addLog([carLog.id]);
                //             maintenanceLog.addCarLog([carLog.id]);
                //             console.log('Log for car ' + car.id + ' attached to maintenance log ' + maintenanceLog.date);
                //         });
                //     });
                // }).then(function() {
                //     res.json(car);
                // }).catch(function(err) {
                //     console.error(err);
                // });
                res.json(car);
            }).catch(function(err) {
                console.error(err);
                res.status(500).json({ error: err });
            });
        // }).catch(function(err) {
        //     console.error(err);
        //     res.status(500).json({ error: err });
        // });
    },

    update: function(req, res) {
        Cars.update({
            licenseNumber: req.body.licenseNumber,
            licensePlate: req.body.licensePlate,
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

    delete: function(req, res) {
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
        // getUserId(req).then(function(organizationId) {
            Cars.findAll({
                where: filterByOrgId
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
                res.status(500).json({ error: err });
            });
        // });
    }
};