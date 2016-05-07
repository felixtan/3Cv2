'use strict';

var models = require('../../db/models');
var Prospects = models.Prospect;
var helpers = require('../helpers');
var getUserId = helpers.getUserId;
var filterByOrgId = helpers.filterByOrgId;

module.exports = {

    get: function(req, res) {
        Prospects.findAll({
            where: filterByOrgId(req)
        }).then(function(prospects) {
            res.json(prospects);
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    getProspect: function(req, res) {
        Prospects.findById(req.params.id).then(function(prospect) {
            if(!prospect) {
                res.status(404).json({ error: 'Prospect not found.' });
            } else {
                res.json(prospect);
            }
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    create: function(req, res) {
        Prospects.create(req.body).then(function(prospect) {
            res.json(prospect);
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    update: function(req, res) {
        Prospects.update(req.body, {
            where: { id: req.params.id }
        }).then(function() {
            res.status(200).json({ msg: 'Updated prospect where id = ' + req.params.id });
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    delete: function(req, res) {
        Prospects.destroy({
            where: { id: req.params.id }
        }).then(function() {
            res.status(200).json({ msg: 'Deleted prospect where id = ' + req.params.id });
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    }
}