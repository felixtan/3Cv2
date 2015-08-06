'use strict';

var models = require('../../db/models');
var EzPass = models.EzPass;
var Driver = models.Driver;

module.exports = {
    get: function(req, res) {
        EzPass.findAll().then(function(passes) {
            res.json(passes);
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    save: function(req, res) {
        EzPass.create({
            number: req.body.number
        }).then(function(pass) {
            Driver.findById(req.body.driverId).then(function(driver) {
                driver.addEzPass([pass.id]);
            });
            // pass.addDriver([req.body.driverId]);
        }).catch(function(err) {
            console.error(err);
        });
    },

    delete: function(req, res) {
        EzPass.destroy({
            where: {
                id: req.params.id
            }
        }) 
        .then(function() {
            res.status(200).json({ msg: 'Deleted ez pass where id = ' + req.params.id });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    }
};