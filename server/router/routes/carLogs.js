'use strict';

var models = require('../../db/models');
var CarLog = models.CarLog;
var Car = models.Car;
var helpers = require('../helpers');
var _ = helpers._;

module.exports = {
    getForAllCars: function(req, res) {
        Car.findAll({ 
            where: helpers.filterByOrgId(req),
        }).then(function(cars) {
            res.json(cars);
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    getForOneCar: function(req, res) {
        Car.findById(req.params.id).then(function(car) {
            res.json(car.logs);
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    update: function(req, res) {
        //console.log(req.params); // { id: '3' }
        //console.log(req.data); // undefined
        //console.log(req.body);  // car
        //console.log(req.query);   // { updateCarData: 'true' }
        Car.update(req.body, { 
            where: { id: req.params.id }
        })
        .then(function(data) {
            console.log(data);
            if(JSON.parse(req.query.updateCarData) === true) {
                console.log('Update car.data and check for oilChangeRequired');
                // 1. compare car.data and log.data
                // _.pluck()
                // 2. for each key/field they have in common, set car.data.field.value = log.data.field.value
            }
            res.status(200).json({ msg: 'New log for car ' + req.params.id }); 
        })
        .catch(function(err) {
            res.status(500).json({ error: err });    
        });

            // CarLogs.max("mileage", { where: { carId: carLog.carId } }).then(function(previouslyCheckedMileage) {
            //     // check if car needs oil change
            //     // TODO: user should be able to set thresholdMileage
            //     var thresholdMileage = 10000;
            //     var oilChangeRequired = (req.body.mileage - previouslyCheckedMileage >= thresholdMileage) || false;
            //     console.log('previouslyCheckedMileage:', previouslyCheckedMileage);
            //     console.log('oilChangeRequired:', oilChangeRequired);
            //     if(oilChangeRequired) {
            //         Cars.findById(carLog.carId).then(function(car) {
            //             car.update({
            //                 oilChangeRequired: true
            //             });
            //         }).catch(function(err) {
            //             console.error(err);
            //         });
            //     }
    },

    delete: function(req, res) {
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