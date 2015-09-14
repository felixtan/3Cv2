'use strict';

var Cars = require('../../db/models').Car;
var getUserId = require('../helpers').getUserId;

module.exports = {

    getCars: function(req, res) {
        Cars.findAll({
            where: {
                organization: getUserId(req)
            }
        }).then(function(cars) {
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
        var organization = getUserId(req);
        console.log('returning organization?',organization); 
        Cars.create({
            tlcNumber: req.body.tlcNumber,
            licensePlateNumber: req.body.licensePlateNumber,
            mileage: req.body.mileage,
            organization: getUserId(req),
            description: req.body.description
        })
        .then(function(car) {
            /**
             * If driverId is defined, then associate the new car with
             * the driver.
             */ 

            // This function was moved to carFormModalInstanceCtrl in the frontend

            // if(req.body.driverId !== null && typeof req.body.driverId !== 'undefined') {
            //     car.addDriver([req.body.driverId]).then(function() {
            //         console.log('Car ' + car.id + ' is associated with Driver ' + req.body.driverId);
            //     });    
            // }

            res.json(car);
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
        Cars.findAll({
            where: {
                organization: getUserId(req)
            }
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
    }
};