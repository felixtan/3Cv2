'use strict';

var models = require('../../db/models');
var sequelize = models.sequelize;
var ProspectStatuses = models.ProspectStatuses;
var helpers = require('../helpers');
var getUserId = helpers.getUserId;
var filterByOrgId = helpers.filterByOrgId;

module.exports = {
    get: get,
    create: create,
    update: update,
}

function get(req, res) {
    ProspectStatuses.findOne({
        where: filterByOrgId(req)
    }).then(function(statuses) {
        // console.log(statuses.dataValues.statuses[0])
        res.json(statuses);
    }).catch(function(err) {
        console.error(err);
        res.status(500).json({ error: err });
    });
}

function create(req, res) {
    ProspectStatuses.create(req.body)
    .then(function(statuses) {
        res.json(statuses);
    }).catch(function(err) {
        console.error(err);
        res.status(500).json({ error: err });
    });
}

function update(req, res) {
    var opts = filterByOrgId(req);
    opts.id = req.body.id;
    // console.log(req.body)
    ProspectStatuses.update(req.body, {
        where: opts
    }).then(function() {
        res.status(200).json({ msg: 'Update a prospect status' });
    }).catch(function(err) {
        console.error(err);
        res.status(500).json({ error: err });
    });
}
