'use strict';

var models = require('../../db/models');
var GasCard = models.GasCard;
var Driver = models.Driver;

module.exports = {
    get: function(req, res) {
        GasCard.findAll().then(function(cards) {
            res.json(cards);
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    save: function(req, res) {
        GasCard.create({
            number: req.body.number
        }).then(function(card) {
            card.addDriver([req.body.driverId]);
        }).catch(function(err) {
            console.error(err);
        });
    }
};