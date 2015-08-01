'use strict';

var DriverLog = require('../../db/models').DriverLog;
var Driver = require('../../db/models').Driver;

module.exports = {

    // many drivers
    // TODO: query filter options and functionality
    getDriversLogs: function(req, res) {
        // gets logs for all drivers
        Driver.findAll({ include: DriverLog }).then(function(drivers) {
            var data = {};
            
            res.json(drivers);
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    // one driver
    // TODO: query filter options and functionality
    getDriverLogs: function(req, res) {
        DriverLog.findAll({ 
            where: {
                driverId: req.params.id
            } 
        })
        .then(function(logs) {
            res.json(logs);
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    // pertains to a specific driver
    saveDriverLog: function(req, res) {
        DriverLog.create({
            uberRevenue: req.body.uberRevenue,
            tollCosts: req.body.tollCosts,
            gasCosts: req.body.gasCosts,
            desposit: req.body.deposit,
            hours: req.body.hours,
            acceptRate: req.body.acceptRate,
            payout: req.body.payout,
            debt: req.body.debt,
            profitsContributed: req.body.profitsContributed
        })
        .then(function(log) {
            Driver.addDriverLog([log.id]).then(function() {
                console.log('Driver ' + req.params.id + ' has new log.');
                res.json(log.dataValues);
            });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    updateDriverLog: function(req, res) {
        DriverLog.update({
            uberRevenue: req.body.uberRevenue,
            tollCosts: req.body.tollCosts,
            gasCosts: req.body.gasCosts,
            desposit: req.body.deposit,
            hours: req.body.hours,
            acceptRate: req.body.acceptRate,
            payout: req.body.payout,
            debt: req.body.debt,
            profitsContributed: req.body.profitsContributed
        }, {
            where: {
                driverId: req.params.id,
                id: req.body.driverLogId
            }
        })
        .then(function() {
            res.status(200).json({ msg: 'Updated log for driver ' + req.params.id });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    deleteDriverLog: function(req, res) {
        DriverLog.destroy({
            where: {
                driverId: req.params.id,
                id: req.body.driverLogId
                // userId: req.user.customData._id
            }
        })
        .then(function() {
            res.status(200).json({ msg: 'Deleted driver log.' });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    }
}