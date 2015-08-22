'use strict';

var models = require('../../db/models');
var Drivers = models.Driver;
var DriverLog = models.DriverLog;
var PtgLogs = models.PtgLog;

module.exports = {

    getDrivers: function(req, res) {
        Drivers.findAll().then(function(drivers) {
            res.json(drivers);
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    getDriver: function(req, res) {
        Drivers.findById(req.params.id).then(function(driver) {
            if(!driver) {
                res.status(404).json({ error: 'Resource not found.' });
                console.log('Driver not found.');
            } else {
                res.json(driver.dataValues);
            }
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    saveDriver: function(req, res) {
        Drivers.create({
            givenName: req.body.givenName,
            middleInitial: req.body.middleInitial,
            surName: req.body.surName,
            driversLicenseNum: req.body.driversLicenseNum,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            address: req.body.address,
            tlc: req.body.tlc,
            dmv: req.body.dmv,
            points: req.body.points,
            accidents: req.body.accidents,
            shift: req.body.shift,
            paperwork: req.body.paperwork,
            description: req.body.description,
            payRate: req.body.payRate
            // userId: req.user.customData._id
        })
        .then(function(driver) {
            /**
             * If carId is defined, then associate the new driver with
             * the car.
             */ 
            if(req.body.carId !== null && typeof req.body.carId !== 'undefined') {
                driver.addCar([req.body.carId]).then(function() {
                    console.log('Driver ' + driver.id + ' is associated with Car ' + req.body.carId);
                });    
            }

            /**
             * Create driver logs
             */
            PtgLogs.findAll().then(function(ptgLogs) {
                ptgLogs.forEach(function(ptgLog) {
                    DriverLog.create({
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
                res.json(driver);
            });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    updateDriver: function(req, res) {
        Drivers.update({
            givenName: req.body.givenName,
            middleInitial: req.body.middleInitial,
            surName: req.body.surName,
            driversLicenseNum: req.body.driversLicenseNum,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            address: req.body.address,
            tlc: req.body.tlc,
            dmv: req.body.dmv,
            points: req.body.points,
            accidents: req.body.accidents,
            shift: req.body.shift,
            paperwork: req.body.paperwork,
            description: req.body.description,
            payRate: req.body.payRate
            // userId: req.user.customData._id
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(function() {
            if(req.body.gasCardId) {
                Drivers.findById(req.params.id).then(function(driver) {
                    driver.setGasCards([req.body.gasCardId]);
                });
            }

            res.status(200).json({ msg: 'Update driver where id = ' + req.params.id });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    deleteDriver: function(req, res) {
        Drivers.destroy({
            where: {
                id: req.params.id
                // userId: req.user.customData._id
            }
        })
        .then(function() {
            res.status(200).json({ msg: 'Deleted driver where id = ' + req.params.id });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    }
}