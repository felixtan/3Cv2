'use strict';

var models = require('../../db/models');
var Prospects = models.Prospect;
var getUserId = require('../helpers').getUserId;

var opts = {};
if(process.env.NODE_ENV === 'production || staging') {
    var organizationId = '';
    opts = { organization: organizationId };
}

module.exports = {

    get: function(req, res) {
        // getUserId(req).then(function(organizationId) {
            Prospects.findAll({
                where: opts
            }).then(function(prospects) {
                res.json(prospects);
            }).catch(function(err) {
                console.error(err);
                res.status(500).json({ error: err });
            });
        // .catch(function(err) {
        //     res.status(500).json({ error: err });
        // });
    },

    getById: function(req, res) {
        Prospects.findById(req.params.id).then(function(prospect) {
            if(!prospect) {
                res.status(404).json({ error: 'Resource not found.' });
                console.log('Prospect not found.');
            } else {
                res.json(prospect);
            }
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    save: function(req, res) {
        // getUserId(req).then(function(organizationId) {
            Prospects.create({
                status: req.body.status,
                givenName: req.body.givenName,
                middleInitial: req.body.middleInitial,
                surName: req.body.surName,
                driversLicenseNum: req.body.driversLicenseNum,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                address: req.body.address,
                tlc: req.body.tlc,
                dmv: req.body.dmv,
                points: req.body.points,
                accidents: req.body.accidents,
                shift: req.body.shift,
                paperwork: req.body.paperwork,
                description: req.body.description,
                organization: organizationId
            })
            .then(function(prospect) {
                res.json(prospect);
            }).catch(function(err) {
                console.error(err);
                res.status(500).json({ error: err });
            });
        // }).catch(function(err) {
        //     console.error(err);
        //     res.status(500).json({ error: err });
        // });
    },

    update: function(req, res) {
        Prospects.update({
            status: req.body.status,
            givenName: req.body.givenName,
            middleInitial: req.body.middleInitial,
            surName: req.body.surName,
            driversLicenseNum: req.body.driversLicenseNum,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            address: req.body.address,
            tlc: req.body.tlc,
            dmv: req.body.dmv,
            points: req.body.points,
            accidents: req.body.accidents,
            shift: req.body.shift,
            paperwork: req.body.paperwork,
            description: req.body.description
        }, {
            where: { id: req.params.id }
        })
        .then(function() {
            res.status(200).json({ msg: 'Update prospect where id = ' + req.params.id });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    },

    delete: function(req, res) {
        Prospects.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(function() {
            res.status(200).json({ msg: 'Deleted prospect where id = ' + req.params.id });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({ error: err });
        });
    }
}