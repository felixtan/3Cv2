'use strict';

var models = require('../models');
// var sequelize = models.sequelize;
var Car = models.Car;
var Driver = models.Driver;
var driverLog = models.DriverLog;
var ptgLog = models.PtgLog;
var Prospects = models.Prospect; 
var CarLog = models.CarLog;
var maintenanceLog = models.MaintenanceLog;
var EzPass = models.EzPass;
var GasCard = models.GasCard;

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
        // Cars
        var car1 = {
                data: {
                    licensePlate: 'T646853C',
                    licenseNumber: 'FUJ 5993',
                    mileage: 12923,
                    description: 'lorem ipsum'
                },
                organizationId: '3Qnv2pMAxLZqVdp7n8RZ0y'
        },
            car2 = {
                data: {
                    licensePlate: 'T627067C',
                    licenseNumber: 'GPJ 6478',
                    mileage: 14081,
                    description: 'lorem ipsum'
                },
                organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x'      
        },
            car3 = {
                data: {
                    licensePlate: 'T657227C',
                    licenseNumber: 'FLJ 6290',
                    mileage: 120461,
                    description: 'lorem ipsum'
                },
                organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x'
        };

        Car.create(car1);
        Car.create(car2);
        Car.create(car3);

        // Prospects
        // var prospect1 = {
        //         name: 'Donald Duck',
        //         description: 'Planning to work 50+ hours',
        //         tlc: '1 month',
        //         dmv: '20',
        //         points: '0',
        //         accidents: '0', 
        //         shift: 'Am/flexible',
        //         address: 'Queens corona',
        //         status: 'rejected',
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // },
        //     prospect2 = {
        //         name: 'James B Grossweiner',
        //         tlc: 'New',
        //         dmv: '7',
        //         accidents: '2', 
        //         shift: 'Pm/flexible',
        //         address: '16043 Claude avenue Jamaica',
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // },
        //     prospect3 = {
        //         name: 'Dovran Esenov',
        //         address: '1802 ocean pkwy a17',
        //         // organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0y'
        // },
        //     prospect4 = {
        //         name: 'Thomas Grube',
        //         tlc: '15',
        //         points: '0',
        //         accidents: '0', 
        //         shift: 'Pm',
        //         address: 'Harlem',
        //         status: 'interviewed',
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // },
        //     prospect5 = {
        //         name: 'Maurice Cloyd',
        //         description: 'Planning to work 55+',
        //         tlc: '1',
        //         dmv: '9',
        //         points: '0',
        //         accidents: '0', 
        //         shift: "Am,pair with gustavo",
        //         address: '3245 Fenton avenue',
        //         status: 'waiting list',
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // };

        // Prospects.create(prospect1);
        // Prospects.create(prospect2);
        // Prospects.create(prospect3);
        // Prospects.create(prospect4);
        // Prospects.create(prospect5);

        // Drivers
        // var driver1 = {
        //         givenName: 'John',
        //         surName: 'Doe',
        //         driversLicenseNum: 'D000-460-60-001-0',
        //         phoneNumber: '9176939103',
        //         email: 'jdoe@gmail.com',
        //         address: '4703 Bayberry Drive Staunton, VA 24401',
        //         payRate: '40',
        //         description: 'drove T627066 1/6/15',
        //         // organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0y'
        // },  
        //     driver2 = {
        //         givenName: 'Seymour',
        //         surName: 'Butz',
        //         driversLicenseNum: 'B320-780-60-001-0',
        //         phoneNumber: '6469210239',
        //         email: 'sbutz@gmail.com',
        //         address: '6774 North Avenue Augusta, GA 30906',
        //         payRate: '50',
        //         points: '0',
        //         dmv: '15',
        //         tlc: '3',
        //         description: 'can start 4/24/15',
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // },
        //     driver3 = {
        //         givenName: 'Max',
        //         surName: 'Powers',
        //         driversLicenseNum: 'P620-540-60-001-0',
        //         phoneNumber: '6462310389',
        //         email: 'mpowers@gmail.com',
        //         address: '8889 Lawrence Street Owatonna, MN 55060',
        //         payRate: '60',
        //         tlc: '2 months',
        //         dmv: '22',
        //         points: '0',
        //         description: 'has ticket for 60',
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // };

        /* LOGS */ 
        // var d = new Date('July 27 2015');
        // var dateInMs = d.getTime();

        // // Car status logs
        // var car1_log = {
        //         date: d,
        //         dateInMs: dateInMs,
        //         licensePlate: car1.licensePlate,
        //         mileage: car1.mileage,
        //         note: "Added too much air, told him to release air",
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // },
        //     car2_log = {
        //         date: d,
        //         dateInMs: dateInMs,
        //         licensePlate: car2.licensePlate,
        //         mileage: car2.mileage,
        //         note: 'Left side back door damage below handle 6 inches below ',
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // },
        //     car3_log = {
        //         date: d,
        //         dateInMs: dateInMs,
        //         licensePlate: car3.licensePlate,
        //         mileage: car3.mileage,
        //         note: 'back right fender needs fixing',
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0y'
        // };

        // // Driver logs
        // var driver1_log = {
        //         date: d,
        //         dateInMs: d.getTime(),
        //         uberRevenue: 1593,
        //         tollCosts: 123,
        //         gasCosts: 140,
        //         deposit: 0,
        //         hours: 45,
        //         acceptRate: 98,
        //         // organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0y'
        // },
        //     driver2_log = {
        //         date: d,
        //         dateInMs: d.getTime(),
        //         uberRevenue: 1061,
        //         tollCosts: 108,
        //         gasCosts: 164,
        //         deposit: 75,
        //         hours: 24.4,
        //         acceptRate: 98,
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // },
        //     driver3_log = {
        //         date: d,
        //         dateInMs: d.getTime(),
        //         uberRevenue: 1388,
        //         tollCosts: 71,
        //         gasCosts: 276,
        //         deposit: 75,
        //         hours: 46.4,
        //         acceptRate: 81,
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // };

        // // PTG Logs
        // var ptgLog1 = {
        //     date: d,
        //     dateInMs: dateInMs,
        //     organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // };

        // // Maintenance Logs
        // var maintenanceLog1 = {
        //     date: d,
        //     dateInMs: dateInMs,
        //     organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // };

        // // Assets
        // var ezPass1 = {
        //         number: '00809549650',
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // },
        //     ezPass2 = {
        //         number: '00809320883',
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // },
        //     ezPass3 = {
        //         number: '00809531889',
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // },
        //     ezPass4 = {
        //         number: '00807409342',
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // };

        // EzPass.create(ezPass1);
        // EzPass.create(ezPass2);
        // EzPass.create(ezPass3);
        // EzPass.create(ezPass4);

        // var gasCard1 = {
        //         number: 'Driver 26 (2336)',
        //         // organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0y'
        // },
        //     gasCard2 = {
        //         number: 'Driver 17 (2278)',
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // },
        //     gasCard3 = {
        //         number: 'Driver 3 (0165)',
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // },
        //     gasCard4 = {
        //         number: 'Driver 30 (8961)',
        //         organization: '3Qnv2pMAxLZqVdp7n8RZ0x'
        // };

        // GasCard.create(gasCard1);
        // GasCard.create(gasCard2);
        // GasCard.create(gasCard3);
        // GasCard.create(gasCard4);

        // // Push the logs
        // ptgLog.create(ptgLog1).then(function(ptgLog) {

        //     maintenanceLog.create(maintenanceLog1).then(function(maintenanceLog) {

        //         Car.create(car1).then(function(car1) {

        //             CarLog.create(car1_log).then(function(carLog) {

        //                 maintenanceLog.addCarLog([carLog.id]);
                    
        //                 Driver.create(driver1).then(function(driver1) {

        //                     driver1.addGasCard([1]);
        //                     driver1.addCar([car1.id]);
        //                     driver1_log.driverId = driver1.id;
        //                     driver1_log.givenName = driver1.givenName;    
        //                     driver1_log.surName = driver1.surName;
                            
        //                     driverLog.create(driver1_log).then(function(driverLog) {
        //                         driver1.addLog([driverLog.id]);
        //                         ptgLog.addDriverLog([driverLog.id]);
                                
        //                         car1.addLog([carLog.id]);
        //                     });
                        
        //                 });
        //             });         

        //         }).then(function() {

        //             Car.create(car2).then(function(car2) {

        //                 CarLog.create(car2_log).then(function(carLog) {

        //                     maintenanceLog.addCarLog([carLog.id]);

        //                     Driver.create(driver2).then(function(driver2) {

        //                         driver2_log.driverId = driver2.id;
        //                         driver2_log.givenName = driver2.givenName;
        //                         driver2_log.surName = driver2.surName;

        //                         driverLog.create(driver2_log).then(function(driverLog) {
        //                             driver2.addLog([driverLog.id]);
        //                             ptgLog.addDriverLog([driverLog.id]);
        //                         });

        //                         Driver.create(driver3).then(function(driver3) {
                                    
        //                             driver2.addCar([car2.id]);
        //                             driver3.addCar([car2.id]);

        //                             driver3_log.driverId = driver3.id;
        //                             driver3_log.givenName = driver3.givenName;
        //                             driver3_log.surName = driver3.surName;
                                    
        //                             driverLog.create(driver3_log).then(function(driverLog) {
        //                                 driver3.addLog([driverLog.id]);
        //                                 ptgLog.addDriverLog([driverLog.id]);
                                        
        //                                 car2.addLog([carLog.id]);
        //                             });
        //                         });

        //                     });
        //                 });

        //             }).then(function() {
        //                 Car.create(car3).then(function(car3) {
        //                     CarLog.create(car3_log).then(function(carLog) {
        //                         car3.addLog([carLog.id]);
        //                         maintenanceLog.addCarLog([carLog.id]);
        //                     });
        //                 });
        //             });
        //         });
        //     });

        // }).then(function() {

        //     console.log('Finished populating the development database.');    

        // });
    }
}

// Need to add logs to their owners

