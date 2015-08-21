'use strict';

var models = require('../../db/models');
var CarLogs = models.CarLog;
var Cars = models.Car;

module.exports = {
    getLogs: function(req, res) {
        Cars.findAll({ include: CarLog }).then(function(cars) {
            res.json(cars);
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    getLog: function(req, res) {
        CarLog.findAll({ 
            where: {
                carId: req.params.id
            } 
        })
        .then(function(logs) {
            res.json(logs);
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    createLog: function(req, res) {
        CarLogs.create({
            tlcNumber: req.body.tlcNumber,
            note: req.body.note
        }).then(function(log) {
            Car.addCarLog([log.id]).then(function() {
                console.log('Car ' + req.params.id + ' has new log.');
                res.json(log.dataValues);
            });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });   
    },

    updateLog: function(req, res) {
        CarLogs.update({
            mileage: req.body.mileage,
            note: req.body.note
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(function() {
            res.status(200).json({ msg: 'Updated log for car ' + req.params.id });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    deleteLog: function(req, res) {
        CarLogs.destroy({
            where: {
                carId: req.params.id,
                id: req.body.carLogId
            }
        })
        .then(function() {
            res.status(200).json({ msg: 'Deleted car log.' });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    }
}