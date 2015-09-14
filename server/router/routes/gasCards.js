'use strict';

var models = require('../../db/models');
var GasCard = models.GasCard;
var Driver = models.Driver;
var getUserId = require('../helpers').getUserId;

module.exports = {
    getAll: function(req, res) {
        getUserId(req).then(function(organizationId) {
            GasCard.findAll({ 
                where: {
                    organization: organizationId
                },
                include: [{
                    model: Driver,
                    where: { organization: organizationId },
                    required: false
                }]
            }).then(function(cards) {

                var minimizedData = {};
                minimizedData = cards;

                minimizedData.forEach(function(card) {
                    delete card.dataValues.createdAt;
                    delete card.dataValues.updatedAt;
                });

                res.json(minimizedData);
            })
            .catch(function(err) {
                throw err;
            });
        })
        .catch(function(err) {
            res.status(500).json({ error: err });
        });
    },

    create: function(req, res) {
        GasCard.create({
            number: req.body.number,
            organization: getUserId(req)
        }).then(function(card) {
            res.json(card);
        }).catch(function(err) {
            console.error(err);
        });
    },

    delete: function(req, res) {
        GasCard.destroy({
            where: {
                id: req.params.id
            }
        }) 
        .then(function() {
            res.status(200).json({ msg: 'Deleted gas card where id = ' + req.params.id });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    }
};