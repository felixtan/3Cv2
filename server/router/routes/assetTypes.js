'use strict';

var models = require('../../db/models');
var sequelize = models.sequelize;
var AssetTypes = models.AssetTypes;
var helpers = require('../helpers');
var getUserId = helpers.getUserId;
var filterByOrgId = helpers.filterByOrgId;

module.exports = {
    get: function(req, res) {
        AssetTypes.findOne({
            where: filterByOrgId(req)
        }).then(function(types) {
            res.json(types);
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    create: function(req, res) {
        AssetTypes.create(req.body)
        .then(function(types) {
            res.json(types);
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    update: function(req, res) {
        AssetTypes.update(req.body, {
            where: filterByOrgId(req)
        }).then(function() {
            res.status(200).json({ msg: 'Update a asset type' });
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    }
}
