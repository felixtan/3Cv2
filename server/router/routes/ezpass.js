'use strict';

var models = require('../../db/models');
var EzPass = models.EzPass;
var Driver = models.Driver;

module.exports = {
    getAll: function(req, res) {
        EzPass.findAll({ include: Driver }).then(function(passes) {

            var minimizedData = {};
            minimizedData = passes;

            minimizedData.forEach(function(pass) {
                delete pass.dataValues.createdAt;
                delete pass.dataValues.updateAt;
            });

            res.json(minimizedData);
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    create: function(req, res) {
        EzPass.create({
            number: req.body.number
        }).then(function(pass) {
           res.json(pass);
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