'use strict';

var Drivers = require('../../db/models').Driver;

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
            surName: req.body.surName,
            driversLicenseNum: req.body.driversLicenseNum,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            address: req.body.address,
            gasCardNum: req.body.gasCardNum,
            ezPassNum: req.body.ezPassNum,
            description: req.body.description
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

            res.json(driver.dataValues);
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    updateDriver: function(req, res) {
        Drivers.update({
            givenName: req.body.givenName,
            surName: req.body.surName,
            driversLicenseNum: req.body.driversLicenseNum,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            address: req.body.address,
            gasCardNum: req.body.gasCardNum,
            ezPassNum: req.body.ezPassNum,
            description: req.body.description,
            // userId: req.user.customData._id
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(function() {
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