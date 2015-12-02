'use strict';

var models = require('../../db/models');
var Cars = models.Car;
var helpers = require('../helpers');
var filterByOrgId = helpers.filterByOrgId;
var getUserId = helpers.getUserId;
var getKeys = helpers.getKeys;
var getOrgId = helpers.getOrgId;
var _ = helpers._;

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

    getModel: function(req, res) {
        Cars.findAll({
            where: filterByOrgId,
            limit: 1
        }).then(function(cars) {
            // use underscore to just return the keys
            console.log(cars[0].dataValues);
            res.json(getKeys(cars[0].dataValues.data));
        }).catch(function(err) {
            res.status(500).json({ error: err });
        });
    },

    create: function(req, res) {
        Cars.create(req.body).then(function(car) {
            console.log(req.body);
            res.json(car);
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
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