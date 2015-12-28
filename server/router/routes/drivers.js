'use strict';

var models = require('../../db/models');
var Drivers = models.Driver;
var DriverLog = models.DriverLog;
var PtgLogs = models.PtgLog;
var GasDriverds = models.GasDriverd;
var EzPasses = models.EzPass;
var Drivers = models.Driver;
var helpers = require('../helpers');
var getUserId = helpers.getUserId;
var filterByOrgId = helpers.filterByOrgId;

var opts = {};
if(process.env.NODE_ENV === 'production' || 'staging') {
    var organizationId = '';
    opts = { organization: organizationId };
}

module.exports = {

    get: function(req, res) {
        Drivers.findAll({
            where: filterByOrgId(req)
        }).then(function(drivers) {
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

    create: function(req, res) {
        Drivers.create(req.body).then(function(driver) {
            var idEachLog = function(driver) {
                return new Promise(function(resolve) {
                    driver.logs.forEach(function(log) {
                        if(!log.driverId || (log.driverId !== driver.id)) log.driverId = driver.id;
                    });

                    resolve(driver);
                });
            };

            idEachLog(driver).then(function(driverWithLogsDriverId) {
                Drivers.update(driverWithLogsDriverId.dataValues, {
                    where: {
                        id: driver.id
                    }
                }).then(function() {
                    res.json(driverWithLogsDriverId);
                });
            });
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
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
                if(req.body.gasDriverdId) {
                    driver.setGasDriverds([req.body.gasDriverdId]);
                }

                if(req.body.ezPassId) {
                    driver.setEzPasses([req.body.ezPassId]);
                }

                if(req.body.driverId) {
                    driver.setDrivers([req.body.driverId]);   
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