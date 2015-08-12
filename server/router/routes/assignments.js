'use strict';

var models = require('../../db/models');
var Cars = models.Car;
var Drivers = models.Driver;

module.exports = {

    // Eager loading of cars and drivers
    getAss: function(req, res) {    
        Cars.findAll({ include: Drivers }).then(function(cars) {
            var minimizedData = cars;
            minimizedData.forEach(function(car) {
                delete car.dataValues.updatedAt;
                delete car.dataValues.createdAt;
                delete car.dataValues.licensePlateNumber;
                delete car.dataValues.mileage;
                delete car.dataValues.description;
                delete car.dataValues.userId;
                
                if(car.dataValues.Drivers && car.dataValues.Drivers.length > 0) {
                    car.dataValues.Drivers.forEach(function(driver) {
                        delete driver.dataValues.Assignment;
                        // delete driver.dataValues.driversLicenseNum;
                        // delete driver.dataValues.phoneNumber;
                        // delete driver.dataValues.email;
                        // delete driver.dataValues.address;
                        // delete driver.dataValues.description;
                        delete driver.dataValues.userId;
                        delete driver.dataValues.createdAt;
                        delete driver.dataValues.updatedAt;
                    });   
                }
            });
            res.json(minimizedData);
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });;
    },

    getDrivers: function(req, res) {
        Drivers.findAll().then(function(drivers) {
            var minimizedData = drivers;
            minimizedData.forEach(function(driver) {
                // delete driver.dataValues.driversLicenseNum;
                // delete driver.dataValues.phoneNumber;
                // delete driver.dataValues.email;
                delete driver.dataValues.address;
                // delete driver.dataValues.description;
                delete driver.dataValues.userId;
                delete driver.dataValues.createdAt;
                delete driver.dataValues.updatedAt;
            });
            res.json(minimizedData);
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    getCars: function(req, res) {
        Cars.findAll().then(function(cars) {
            var minimizedData = cars;
            minimizedData.forEach(function(car) {
                delete car.dataValues.updatedAt;
                delete car.dataValues.createdAt;
                delete car.dataValues.licensePlateNumber;
                delete car.dataValues.mileage;
                delete car.dataValues.description;
                delete car.dataValues.userId;
                delete car.dataValues.oilChangeRequired;
            });
            res.json(minimizedData);
        })
        .catch(function(err) {
            res.status(500).json({ error: err });
        });
    },

    reassignDriver: function(req, res) {
        Drivers.findById(req.params.id).then(function(driver) {
            driver.removeCar([req.body.oldCar]).then(function() {
                driver.addCar([req.body.newCar]).then(function() {
                    console.log('Driver ' + driver.givenName + ' ' + driver.surName + ' is reassigned to car ' + req.body.newCar + '.');
                }, function(err) {
                    console.error(err);
                });
            }, function(err) {
                console.error(err);
            });
        });
    },

    assign: function(req, res) {
        Drivers.findById(req.params.driverId).then(function(driver) {
            driver.addCar([req.params.carId]).then(function(data) {
                console.log('Car ' + req.params.carId + ' is associated with driver ' + req.params.driverId + '.');
                res.json(data);
            }, function(err) {
                    res.status(500).json({ error: err });
            });
        }, function(err) {
                res.status(500).json({ error: err });
        });
    }
}