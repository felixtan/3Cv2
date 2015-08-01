'use strict';

var models = require('../../db/models');
var sequelize = models.sequelize;
var PtgLogs = models.PtgLog;
var DriverLogs = models.DriverLog;

module.exports = {
    getLogs: function(req, res) {
        PtgLogs.findAll({ order: '"dateInMs"', include: DriverLogs }).then(function(logs) {
            res.json(logs);
        }).catch(function(err) {
            console.log(err);
            res.status(500).json({ error: err });
        });
    }
}