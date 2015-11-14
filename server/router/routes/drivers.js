'use strict';

var models = require('../../db/models');
var Drivers = models.Driver;
var DriverLog = models.DriverLog;
var PtgLogs = models.PtgLog;
var GasCards = models.GasCard;
var EzPasses = models.EzPass;
var Cars = models.Car;
var getUserId = require('../helpers').getUserId;

var opts = {};
if(process.env.NODE_ENV === 'production' || 'staging') {
    var organizationId = '';
    opts = { organization: organizationId };
}

module.exports = {

    get: function(req, res) {
        Drivers.findAll({
            where: opts,
            include: [{
                model: Cars,
                where: opts,
                required: false
            }, {
                model: GasCards,
                where: opts,
                required: false
            }, {
                model: EzPasses,
                where: opts,
                required: false
            }]
        }).then(function(drivers) {
            // no data minimization here because maybe iterating
            // through arrays is more expensive than sending a bigger request?
            res.json(drivers);
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    getById: function(req, res) {
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

    save: function(req, res) {
        // getUserId(req).then(function(organizationId) {
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
                payRate: req.body.payRate,
                organization: organizationId
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
                PtgLogs.findAll({
                    where: opts
                }).then(function(ptgLogs) {
                    ptgLogs.forEach(function(ptgLog) {
                        DriverLog.create({
                            date: ptgLog.date,
                            dateInMs: ptgLog.dateInMs,
                            givenName: driver.givenName,
                            surName: driver.surName,
                            organization: organizationId
                        }).then(function(driverLog) {
                            driver.addLog([driverLog.id]);
                            ptgLog.addDriverLog([driverLog.id]);
                        });
                    });
                }).then(function() {
                    res.json(driver);
                }).catch(function(err) {
                    console.error(err);
                });
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
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(function() {
            
            Drivers.findById(req.params.id).then(function(driver) {
                if(req.body.gasCardId) {
                    driver.setGasCards([req.body.gasCardId]);
                }

                if(req.body.ezPassId) {
                    driver.setEzPasses([req.body.ezPassId]);
                }

                if(req.body.carId) {
                    driver.setCars([req.body.carId]);   
                }
            });

            res.status(200).json({ msg: 'Update driver where id = ' + req.params.id });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    delete: function(req, res) {
        Drivers.destroy({
            where: {
                id: req.params.id
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