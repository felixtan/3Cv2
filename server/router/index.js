'use strict';

/**
 * The Index of Routes
 */

var stormpath = require('express-stormpath');
var cars = require('./routes/cars');
var drivers = require('./routes/drivers');
var prospects = require('./routes/prospects');
var prospectStatuses = require('./routes/prospectStatuses');
var assets = require('./routes/assets');
var assetTypes = require('./routes/assetTypes');

module.exports = function (app) {

    // Asset Types
    app.get('/api/asset-types', assetTypes.get);
    app.post('/api/asset-types', assetTypes.create);
    app.put('/api/asset-types', assetTypes.update);

    // Assets
    app.get('/api/assets', assets.get);
    app.get('/api/assets/:id', assets.getById);
    app.post('/api/assets', assets.create);
    app.put('/api/assets/:id', assets.update);
    app.delete('/api/assets/:id', assets.delete);

    // Prospect Statuses
    app.get('/api/prospect-statuses', prospectStatuses.get);
    app.post('/api/prospect-statuses', prospectStatuses.create);
    app.put('/api/prospect-statuses', prospectStatuses.update);

    // Prospects
    app.get('/api/prospects', prospects.get);
    app.get('/api/prospects/:id', prospects.getProspect);
    app.post('/api/prospects', prospects.create);
    app.put('/api/prospects/:id', prospects.update);
    app.delete('/api/prospects/:id', prospects.delete);

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
