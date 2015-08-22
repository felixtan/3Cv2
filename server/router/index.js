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
var maintenanceLogs = require('./routes/maintenanceLogs');

module.exports = function (app) {

    // Car logs
    app.get('/api/logs/cars', carLogs.getLogs);
    app.get('/api/logs/cars/:id', carLogs.getLog);
    app.post('/api/logs/cars/:id', carLogs.createLog);
    app.put('/api/logs/cars/:id', carLogs.updateLog);

    // Maintenance logs
    app.get('/api/logs/maintenance', maintenanceLogs.getLogs);
    app.post('/api/logs/maintenance', maintenanceLogs.createLogs);

    // Prospects
    app.get('/api/prospects', prospect.getProspects);
    app.get('/api/prospects/:id', prospect.getProspect);
    app.post('/api/prospects', prospect.saveProspect);
    app.put('/api/prospects/:id', prospect.updateProspect);
    app.delete('/api/prospects/:id', prospect.deleteProspect);

    // EZ pass
    app.get('/api/assets/ezpass', ezPass.get);
    app.post('/api/assets/ezpass', ezPass.save);
    app.delete('/api/assets/ezpass', ezPass.delete);

    // Gas cards
    app.get('/api/assets/gas-cards', gasCards.getAll);
    app.post('/api/assets/gas-cards', gasCards.create);
    app.delete('/api/assets/gas-cards', gasCards.delete);

    // PTG logs
    app.get('/api/logs/ptg', ptgLogs.getLogs);
    app.post('/api/logs/ptg', ptgLogs.createLog);

    // Driver logs
    app.get('/api/logs/drivers', driverLogs.getDriversLogs);
    app.get('/api/logs/drivers/:id', driverLogs.getDriverLogs);
    app.post('/api/logs/drivers/:id', driverLogs.saveDriverLog);
    app.put('/api/logs/drivers/:id', driverLogs.updateDriverLog);

    // Assignments
    app.get('/api/assignments', assignments.getAss);
    app.get('/api/assignments/drivers', assignments.getDrivers);
    app.put('/api/assignments/drivers/:id', assignments.reassignDriver);
    app.get('/api/assignments/cars', assignments.getCars);
    app.post('/api/assignments/driver=:driverId/car=:carId', assignments.assign);

    // Car API routes
    app.get('/api/cars', cars.getCars);
    app.get('/api/cars/:id', cars.getCar);
    app.post('/api/cars', cars.saveCar);
    app.put('/api/cars/:id', cars.updateCar);
    app.delete('/api/cars/:id', cars.deleteCar);
    app.put('/api/cars', cars.rearrange);   // handles persisting changes to ordering in cars array

    // Driver API routes
    app.get('/api/drivers', drivers.getDrivers);
    app.get('/api/drivers/:id', drivers.getDriver);
    app.post('/api/drivers', drivers.saveDriver);
    app.put('/api/drivers/:id', drivers.updateDriver);
    app.delete('/api/drivers/:id', drivers.deleteDriver);
};