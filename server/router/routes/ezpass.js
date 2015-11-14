'use strict';

var models = require('../../db/models');
var EzPass = models.EzPass;
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
            EzPass.findAll({ 
                where: opts,
                include: [{
                    model: Driver,
                    where: opts,
                    required: false
                }]
            }).then(function(passes) {

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
        // })
        // .catch(function(err) {
        //     res.status(500).json({ error: err });
        // });
    },

    create: function(req, res) {
        // getUserId(req).then(function(organizationId) {
            EzPass.create({
                number: req.body.number,
                organization: organizationId
            }).then(function(pass) {
               res.json(pass);
            }).catch(function(err) {
                console.error(err);
                res.status(500).json({ error: err });
            });
        // }).catch(function(err) {
        //     res.status(500).json({ error: err });
        // });
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