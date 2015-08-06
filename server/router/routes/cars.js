'use strict';

var Cars = require('../../db/models').Car;

module.exports = {

    getCars: function(req, res) {
        Cars.findAll().then(function(cars) {
            console.log(cars);
            res.json(cars);
        })
        .catch(function(err) {
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
                res.json(car.dataValues);
            }
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    saveCar: function(req, res) {
        Cars.create({
            tlcNumber: req.body.tlcNumber,
            licensePlateNumber: req.body.licensePlateNumber,
            mileage: req.body.mileage,
            oilChangeRequired: false,
            // userId: req.user.customData._id,
            description: req.body.description
        })
        .then(function(car) {
            /**
             * If driverId is defined, then associate the new car with
             * the driver.
             */ 
            if(req.body.driverId !== null && typeof req.body.driverId !== 'undefined') {
                car.addDriver([req.body.driverId]).then(function() {
                    console.log('Car ' + car.id + ' is associated with Driver ' + req.body.driverId);
                });    
            }

            res.json(car.dataValues);
        })
        .catch(function(err) {
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
                // userId: req.user.customData._id
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

    disassociateDrivers: function(req, res) {
        // untested function

        /**
         * 1. Takes an array of driver ids.
         * 2. Performs difference operation between array of all driver ids and input array.
         * 3. Call cars.setDrivers()
         */


    }
};