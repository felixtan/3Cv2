'use strict';

var models = require('../../db/models');
var Cars = models.Car;
var helpers = require('../helpers');
var filterByOrgId = helpers.filterByOrgId;
var getUserId = helpers.getUserId;
var getKeys = helpers.getKeys;
var getOrgId = helpers.getOrgId;
var _ = helpers._;
var Promise = require('Bluebird');

module.exports = {

    get: function(req, res) {
        Cars.findAll({
            where: filterByOrgId(req)
        }).then(function(cars) {
            res.json(cars);
        }).catch(function(err) {
            res.status(500).json({ error: err });
        });
    },

    getCar: function(req, res) {
        Cars.findById(req.params.id).then(function(car) {
            if(!car) {
                res.status(404).json({ error: 'Car not found.' });
            } else {
                res.json(car);
            }
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    create: function(req, res) {
        Cars.create(req.body).then(function(car) {
            var idEachLog = function(car) {
                return new Promise(function(resolve) {
                    car.logs.forEach(function(log) {
                        if(!log.carId || (log.carId !== car.id)) log.carId = car.id;
                    });

                    resolve(car);
                });
            };

            idEachLog(car).then(function(carWithLogsCarId) {
                Cars.update(carWithLogsCarId.dataValues, {
                    where: {
                        id: car.id
                    }
                }).then(function() {
                    res.json(carWithLogsCarId);
                });
            });
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    update: function(req, res) {
        Cars.update(req.body, {
            where: { id: req.params.id }
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
            where: { id: req.params.id }
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