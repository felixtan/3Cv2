'use strict';

var models = require('../models'),
    ProspectStatuses = models.ProspectStatuses,
    AssetTypes = models.AssetTypes;

module.exports = {

    createAssetTypes: function (organizationId) {
        AssetTypes.create({
            organizationId: organizationId,
            data: {},
            types: [],
        });
    },

    createDefaultProspectStatuses: function (organizationId) {
        ProspectStatuses.create({
            organizationId: organizationId,
            data: {},
            statuses: [
                {
                    value: 'Callers'
                },
                {
                    value: 'Interviewed'
                },
                {
                    value: 'Waiting List'
                },
                {
                    value: 'Rejected'
                },
                {
                    value: 'Unassigned',
                    special: true
                }
            ]
        });
    }
}