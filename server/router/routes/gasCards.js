'use strict';

var models = require('../../db/models');
var GasCard = models.GasCard;
var Driver = models.Driver;
var getUserId = require('../helpers').getUserId;

var opts = {};
if(process.env.NODE_ENV === 'production' || 'staging') {
    var organizationId = '';
    opts = { organization: organizationId };
}

module.exports = {
    get: function(req, res) {
        // getUserId(req).then(function(organizationId) {
            GasCard.findAll({ 
                where: opts,
                include: [{
                    model: Driver,
                    where: opts,
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
                console.error(err);
                res.status(500).json({ error: err });
            });
        // })
        // .catch(function(err) {
        //     res.status(500).json({ error: err });
        // });
    },

    create: function(req, res) {
        // getUserId(req).then(function(organizationId) {
            GasCard.create({
                number: req.body.number,
                organization: organizationId
            }).then(function(card) {
                res.json(card);
            }).catch(function(err) {
                console.error(err);
                res.status(500).json({ error: err });
            });
        // }).catch(function(err) {
        //     res.status(500).json({ error: err });
        // });
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