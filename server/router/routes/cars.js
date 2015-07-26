'use strict';

var Cars = require('../../db/models').Cars;

module.exports = {

    getCars: function(req, res) {
        Cars.findAll().then(function(cars) {
            res.json(cars);
            // return cars;
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
    }
};