'use strict';

var models = require('../models');
// var sequelize = models.sequelize;
var Car = models.Car;
var Driver = models.Driver;
var driverLog = models.DriverLog;

// Populate the db with fake data

module.exports = {

    test: function() {
        
        // sequelize.query(queryString, { model: Car }).then(function(cars) {
        //     console.log('test query result:', cars);
        // });

        Car.findAll().then(function(cars) {
            console.log(cars);
        });
    },

    populate: function() {
        // sequelize.query('INSERT INTO "Cars" (' +
        //     '"tlcNumber",' +
        //     '"licensePlateNumber",' +
        //     '"mileage",' +
        //     '"description"' +
        //     ') VALUES (' +
        //     'lol,' +
        //     '"lolol",' +
        //     '"100",' +
        //     '"lololol"' +
        //     ') RETURNING *;',
        // { model: Car }).then(function(car) {
        //     console.log('populate query result:', car);
        // }).catch(function(err) {
        //     console.error(err);
        // });
        
        // Cars
        var car1 = {
                tlcNumber: '1A10',
                licensePlateNumber: 'FUJ 5993',
                mileage: 12923,
                description: 'lorem ipsum'
        },
            car2 = {
                tlcNumber: '2C51',
                licensePlateNumber: 'GPJ 6478',
                mileage: 14081,
                description: 'lorem ipsum'      
        },
            car3 = {
                tlcNumber: '8N32',
                licensePlateNumber: 'FLJ 6290',
                mileage: 120461,
                description: 'lorem ipsum' 
        };

        // Drivers
        var driver1 = {
                givenName: 'John',
                surName: 'Doe',
                driversLicenseNum: 'D000-460-60-001-0',
                phoneNumber: '9176939103',
                email: 'jdoe@gmail.com',
                address: '4703 Bayberry Drive Staunton, VA 24401',
                payRate: '40',
                description: 'lorem ipsum'
        },  
            driver2 = {
                givenName: 'Seymour',
                surName: 'Butz',
                driversLicenseNum: 'B320-780-60-001-0',
                phoneNumber: '6469210239',
                email: 'sbutz@gmail.com',
                address: '6774 North Avenue Augusta, GA 30906',
                payRate: '50',
                description: 'lorem ipsum'
        },
            driver3 = {
                givenName: 'Max',
                surName: 'Powers',
                driversLicenseNum: 'P620-540-60-001-0',
                phoneNumber: '6462310389',
                email: 'mpowers@gmail.com',
                address: '8889 Lawrence Street Owatonna, MN 55060',
                payRate: '60',
                description: 'lorem ipsum'
        };

        // Driver logs
        var driver1_log = {
                week: new Date('July 27, 2015'),
                uberRevenue: 1593,
                tollCosts: 123,
                gasCosts: 140,
                desposit: 0,
                hours: 45,
                acceptRate: 98
        },
            driver2_log = {
                week: new Date('July 27, 2015'),
                uberRevenue: 1061,
                tollCosts: 108,
                gasCosts: 164,
                desposit: 75,
                hours: 24.4,
                acceptRate: 98
        },
            driver3_log = {
                week: new Date('July 27, 2015'),
                uberRevenue: 1388,
                tollCosts: 71,
                gasCosts: 276,
                desposit: 75,
                hours: 46.4,
                acceptRate: 81
        };

        Car.create(car1).then(function(car1) {

            Driver.create(driver1).then(function(driver) {
                driver.addCar([car1.id]);
                driver1_log.driverId = driver.id;
            }).then(function() {
                driverLog.create(driver1_log);
            });

        })
        .then(function() {

            Car.create(car2).then(function(car2) {
                // Driver.create(driver2).then(function(driver) {
                //     driver.addCar([car.id]);
                //     driver2_log.driverId = driver.id;
                // }).then(function() {
                //     driverLog.create(driver2_log);
                // });

                Car.create(car3).then(function(car3) {
                    Driver.create(driver2).then(function(driver2) {
                        driver2_log.driverId = driver2.id;
                        driverLog.create(driver2_log);
                        Driver.create(driver3).then(function(driver3) {
                            driver2.addCar([car3.id]);
                            driver3.addCar([car3.id]);
                            driver3_log.driverId = driver3.id;
                        })
                        .then(function() {
                            driverLog.create(driver3_log);
                        });
                    });
                });
            });
        });
    }
}

