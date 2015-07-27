'use strict';

/**
 * The Index of Routes
 */

var cars = require('./routes/cars');
var drivers = require('./routes/drivers');
var main = require('./routes/main');

module.exports = function (app) {

    // Dashboard/Main UI
    app.get('/', main.render);

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
