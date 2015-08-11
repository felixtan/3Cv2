'use strict';

var models = require('../models');
// var sequelize = models.sequelize;
var Car = models.Car;
var Driver = models.Driver;
var driverLog = models.DriverLog;
var ptgLog = models.PtgLog;
var Prospects = models.Prospect; 

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
        // Prospects
        var prospect1 = {
                givenName: 'Donald',
                surName: 'Duck',
                description: 'Planning to work 50+ hours',
                tlc: '1 month',
                dmv: '20',
                points: '0',
                accidents: '0', 
                shift: 'Am/flexible',
                address: 'Queens corona',
                status: 'rejected'
        },
            prospect2 = {
                givenName: 'James',
                middleInitial: 'B',
                surName: 'Grossweiner',
                tlc: 'New',
                dmv: '7',
                accidents: '2', 
                shift: 'Pm/flexible',
                address: '16043 Claude avenue Jamaica'
        },
            prospect3 = {
                givenName: 'Dovran',
                surName: 'Esenov',
                address: '1802 ocean pkwy a17'
        },
            prospect4 = {
                givenName: 'Thomas',
                surName: 'Grube',
                tlc: '15',
                points: '0',
                accidents: '0', 
                shift: 'Pm',
                address: 'Harlem',
                status: 'interviewed'
        },
            prospect5 = {
                givenName: 'Maurice',
                surName: 'Cloyd',
                description: 'Planning to work 55+',
                tlc: '1',
                dmv: '9',
                points: '0',
                accidents: '0', 
                shift: "Am,pair with gustavo",
                address: '3245 Fenton avenue',
                status: 'waiting list'
        };

        Prospects.create(prospect1);
        Prospects.create(prospect2);
        Prospects.create(prospect3);
        Prospects.create(prospect4);
        Prospects.create(prospect5);
        
        // Cars
        var car1 = {
                tlcNumber: 'T646853C',
                licensePlateNumber: 'FUJ 5993',
                mileage: 12923,
                description: 'lorem ipsum'
        },
            car2 = {
                tlcNumber: 'T627067C',
                licensePlateNumber: 'GPJ 6478',
                mileage: 14081,
                description: 'lorem ipsum'      
        },
            car3 = {
                tlcNumber: 'T657227C',
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
                description: 'drove T627066 1/6/15'
        },  
            driver2 = {
                givenName: 'Seymour',
                surName: 'Butz',
                driversLicenseNum: 'B320-780-60-001-0',
                phoneNumber: '6469210239',
                email: 'sbutz@gmail.com',
                address: '6774 North Avenue Augusta, GA 30906',
                payRate: '50',
                points: '0',
                dmv: '15',
                tlc: '3',
                description: 'can start 4/24/15'
        },
            driver3 = {
                givenName: 'Max',
                surName: 'Powers',
                driversLicenseNum: 'P620-540-60-001-0',
                phoneNumber: '6462310389',
                email: 'mpowers@gmail.com',
                address: '8889 Lawrence Street Owatonna, MN 55060',
                payRate: '60',
                tlc: '2 months',
                dmv: '22',
                points: '0',
                description: 'has ticket for 60'
        };


        // Driver logs
        var d = new Date('July 27 2015');
        var driver1_log = {
                date: d,
                dateInMs: d.getTime(),
                uberRevenue: 1593,
                tollCosts: 123,
                gasCosts: 140,
                deposit: 0,
                hours: 45,
                acceptRate: 98
        },
            driver2_log = {
                date: d,
                dateInMs: d.getTime(),
                uberRevenue: 1061,
                tollCosts: 108,
                gasCosts: 164,
                deposit: 75,
                hours: 24.4,
                acceptRate: 98
        },
            driver3_log = {
                date: d,
                dateInMs: d.getTime(),
                uberRevenue: 1388,
                tollCosts: 71,
                gasCosts: 276,
                deposit: 75,
                hours: 46.4,
                acceptRate: 81
        };


        // PTG Logs
        var ptgLog1 = {
            date: d,
            dateInMs: d.getTime()
        };

        ptgLog.create(ptgLog1).then(function(ptgLog) {

            Car.create(car1).then(function(car1) {

                Driver.create(driver1).then(function(driver) {

                    driver.addCar([car1.id]);
                    driver1_log.driverId = driver.id;
                    driver1_log.givenName = driver.givenName;    
                    driver1_log.surName = driver.surName;
                    
                    driverLog.create(driver1_log).then(function(log) {
                        driver.addLog([log.id]);
                        ptgLog.addDriverLog([log.id]);
                    });
                
                });

            }).then(function() {

                Car.create(car2).then(function(car2) {

                    Driver.create(driver2).then(function(driver2) {

                        driver2_log.driverId = driver2.id;
                        driver2_log.givenName = driver2.givenName;
                        driver2_log.surName = driver2.surName;

                        driverLog.create(driver2_log).then(function(log) {
                            driver2.addLog([log.id]);
                            ptgLog.addDriverLog([log.id]);
                        });

                        Driver.create(driver3).then(function(driver3) {
                            
                            driver2.addCar([car2.id]);
                            driver3.addCar([car2.id]);

                            driver3_log.driverId = driver3.id;
                            driver3_log.givenName = driver3.givenName;
                            driver3_log.surName = driver3.surName;
                            
                            driverLog.create(driver3_log).then(function(log) {
                                driver3.addLog([log.id]);
                                ptgLog.addDriverLog([log.id]);
                            });
                        });

                    });

                }).then(function() {
                    Car.create(car3);
                });
            });
        }).then(function() {
            console.log('Finished populating the development database.');    
        });
    }
}

// Need to add logs to their owners

