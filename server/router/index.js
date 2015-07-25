'use strict';

/**
 * The Index of Routes
 */

var cars = require('./routes/cars');
var drivers = require('./routes/drivers');

module.exports = function (app) {

    // Car routes
    app.get('/api/cars', cars.getCars);
    app.get('/api/cars/:id', cars.getCar);
    app.post('/api/cars', cars.saveCar);
    app.put('/api/cars/:id', cars.updateCar);
    app.delete('/api/cars/:id', cars.deleteCar);

    // Driver routes
    app.get('/api/drivers', drivers.getDrivers);
    app.get('/api/drivers/:id', drivers.getDriver);
    app.post('/api/drivers', drivers.saveDriver);
    app.put('/api/drivers/:id', drivers.updateDriver);
    app.delete('/api/drivers/:id', drivers.deleteDriver);
};
