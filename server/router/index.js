'use strict';

/**
 * The Index of Routes
 */

var cars = require('./routes/cars');
var drivers = require('./routes/drivers');
var driverLogs = require('./routes/driverlogs');
var prospectStatuses = require('./routes/prospectStatuses');
var gasCards = require('./routes/gasCards');
var ezPass = require('./routes/ezpass');
var prospect = require('./routes/prospects');
var carLogs = require('./routes/carLogs');
var stormpath = require('express-stormpath');

module.exports = function (app) {

    // uncomment when you want stormpath
    // app.use('/api', stormpath.loginRequired);

    // Prospect Statuses
    app.get('/api/prospectStatuses', prospectStatuses.get);
    app.post('/api/prospectStatuses', prospectStatuses.create);
    app.put('/api/prospectStatuses', prospectStatuses.update);

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

    // Car API routes
    app.get('/api/cars', cars.get);
    app.get('/api/cars/:id', cars.getCar);
    app.post('/api/cars', cars.create);
    app.put('/api/cars/:id', cars.update);
    app.delete('/api/cars/:id', cars.delete);

    // Driver API routes
    app.get('/api/drivers', drivers.get);
    app.get('/api/drivers/:id', drivers.getDriver);
    app.post('/api/drivers', drivers.create);
    app.put('/api/drivers/:id', drivers.update);
    app.delete('/api/drivers/:id', drivers.delete);
};