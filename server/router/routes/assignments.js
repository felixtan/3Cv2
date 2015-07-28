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
                        delete driver.dataValues.driversLicenseNum;
                        delete driver.dataValues.phoneNumber;
                        delete driver.dataValues.email;
                        delete driver.dataValues.address;
                        delete driver.dataValues.description;
                        delete driver.dataValues.userId;
                        delete driver.dataValues.createdAt;
                        delete driver.dataValues.updatedAt;
                    });   
                }
            });
            res.json(minimizedData);
        });
    }
}