'use strict';

var models = require('../../db/models');
var Assets = models.Asset;
var helpers = require('../helpers');
var getUserId = helpers.getUserId;
var filterByOrgId = helpers.filterByOrgId;

module.exports = {

    get: function(req, res) {
        Assets.findAll({ 
            where: filterByOrgId(req),
        }).then(function(assets) {
            res.json(assets);
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    getById: function(req, res) {
        Assets.findById(req.params.id).then(function(asset) {
            if(!asset) {
                res.status(404).json({ error: 'Asset not found.' });
            } else {
                res.json(asset);
            }
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    create: function(req, res) {
        Assets.create(req.body).then(function(asset) {
            res.json(asset);
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    update: function(req, res) {
        Assets.update(req.body, {
            where: { id: req.params.id }
        }).then(function() {
            res.status(200).json({ msg: 'Updated asset where id = ' + req.params.id });
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    delete: function(req, res) {
        Assets.destroy({
            where: { id: req.params.id }
        }) .then(function() {
            res.status(200).json({ msg: 'Deleted asset where id = ' + req.params.id });
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    }
};