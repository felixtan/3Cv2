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

module.exports = function (app) {
    
    // Driver Assets
    app.get('/api/assets/gas-cards', gasCards.get);
    app.post('/api/assets/gas-cards', gasCards.save);

    // PTG logs
    app.get('/api/logs/ptg', ptgLogs.getLogs);
    app.post('/api/logs/ptg', ptgLogs.createLog);

    // Driver logs
    app.get('/api/logs/drivers', driverLogs.getDriversLogs);
    app.get('/api/logs/drivers/:id', driverLogs.getDriverLogs);
    app.post('/api/logs/drivers/:id', driverLogs.saveDriverLog);
    app.put('/api/logs/drivers/:id', driverLogs.updateDriverLog);

    // Dashboard/Main UI
    app.get('/api/assignments', assignments.getAss);
    app.get('/api/assignments/drivers', assignments.getDrivers);
    app.get('/api/assignments/cars', assignments.getCars);

    // Car API routes
    app.get('/api/cars', cars.getCars);
    app.get('/api/cars/:id', cars.getCar);
    app.post('/api/cars', cars.saveCar);
    app.put('/api/cars/:id', cars.updateCar);
    app.delete('/api/cars/:id', cars.deleteCar);

    // Driver API routes
    app.get('/api/drivers', drivers.getDrivers);
    app.get('/api/drivers/:id', drivers.getDriver);
    app.post('/api/drivers', drivers.saveDriver);
    app.put('/api/drivers/:id', drivers.updateDriver);
    app.delete('/api/drivers/:id', drivers.deleteDriver);
};