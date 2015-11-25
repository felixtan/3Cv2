'use strict';

/**
 * The Index of Routes
 */

var cars = require('./routes/cars');
var drivers = require('./routes/drivers');
var assignments = require('./routes/assignments');
var driverLogs = require('./routes/driverlogs');
var ptgLogs = require('./routes/ptglogs');
var gasCards = require('./routes/gasCards');
var ezPass = require('./routes/ezpass');
var prospect = require('./routes/prospects');
var carLogs = require('./routes/carLogs');

module.exports = function (app) {

    
    // settings
    app.get('/api/settings/cars', cars.getModel);

    // Car logs
    app.get('/api/logs/cars', carLogs.getForAllCars);
    app.get('/api/logs/cars/:id', carLogs.getForOneCar);
    // app.post('/api/logs/cars/:id', carLogs.create);
    app.put('/api/logs/cars/:id', carLogs.update);

    // Prospects
    app.get('/api/prospects', prospect.get);
    app.get('/api/prospects/:id', prospect.getById);
    app.post('/api/prospects', prospect.save);
    app.put('/api/prospects/:id', prospect.update);
    app.delete('/api/prospects/:id', prospect.delete);

    // EZ pass
    app.get('/api/assets/ez-passes', ezPass.get);
    app.post('/api/assets/ez-passes', ezPass.create);
    app.delete('/api/assets/ez-passes', ezPass.delete);

    // Gas cards
    app.get('/api/assets/gas-cards', gasCards.get);
    app.post('/api/assets/gas-cards', gasCards.create);
    app.delete('/api/assets/gas-cards', gasCards.delete);

    // PTG logs
    app.get('/api/logs/ptg', ptgLogs.get);
    app.post('/api/logs/ptg', ptgLogs.create);

    // Driver logs
    app.get('/api/logs/drivers', driverLogs.getAll);
    app.get('/api/logs/drivers/:id', driverLogs.getByDriverId);
    app.post('/api/logs/drivers/:id', driverLogs.save);
    app.put('/api/logs/drivers/:id', driverLogs.update);

    // Assignments
    app.get('/api/assignments', assignments.get);
    app.get('/api/assignments/drivers', assignments.getDrivers);
    app.put('/api/assignments/drivers/:id', assignments.reassignDriver);
    app.get('/api/assignments/cars', assignments.getCars);
    app.post('/api/assignments/driver=:driverId/car=:carId', assignments.assign);

    // Car API routes
    app.get('/api/cars', cars.get);
    app.get('/api/cars/:id', cars.getCar);
    app.post('/api/cars', cars.create);
    app.put('/api/cars/:id', cars.update);
    app.delete('/api/cars/:id', cars.delete);
    app.put('/api/cars', cars.rearrange);   // handles persisting changes to ordering in cars array

    // Driver API routes
    app.get('/api/drivers', drivers.get);
    app.get('/api/drivers/:id', drivers.getById);
    app.post('/api/drivers', drivers.save);
    app.put('/api/drivers/:id', drivers.update);
    app.delete('/api/drivers/:id', drivers.delete);
};