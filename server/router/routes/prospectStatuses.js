'use strict';

var models = require('../../db/models');
var sequelize = models.sequelize;
var ProspectStatuses = models.ProspectStatuses;
var helpers = require('../helpers');
var getUserId = helpers.getUserId;
var filterByOrgId = helpers.filterByOrgId;

module.exports = {
    get: function(req, res) {
        ProspectStatuses.findOne({ 
            where: filterByOrgId(req)
        }).then(function(statuses) {
            res.json(statuses);
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    create: function(req, res) {
        ProspectStatuses.create(req.body)
        .then(function(statuses) {
            res.json(statuses);
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    update: function(req, res) {
        ProspectStatuses.update(req.body, {
            where: filterByOrgId(req)
        }).then(function() {
            res.status(200).json({ msg: 'Update a prospect status' });
        }).catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    }
}