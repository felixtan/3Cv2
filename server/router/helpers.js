var Promise = require('bluebird');
var _ = require('underscore');

module.exports = {
    // for getting stormpath user id stored in customData
    getUserId: function(req) {
        return new Promise(function(resolve, reject) {
            req.user.getCustomData(function(err, data) {
                if(err) {
                    reject(err);
                } else {
                    resolve(data.id);
                }
            });
        });
    },

    // extracts the keys of an object into an array
    getKeys: function(obj) {
        return _.keys(obj);
    },

    // used by cars.get
    // in development or testing, organizationId will be in every req.body
    // in production or staging, organiizationId will be in req.user.customData thanks to stormpath.postRegistrationHandler
    // used for where filtering sequelize querying
    filterByOrgId: function(req) {
        if(process.env.NODE_ENV === ('production' || 'staging')) {
            opts = { organizationId: req.user.customData.organizationId };
        } else {
            opts = { organizationId: req.query.organizationId }
        }

        return opts;
    },

    // used for create methods
    getOrgId: function(req) {
        return (process.env.NODE_ENV === 'production' || 'staging') ? req.user.customData.organizationId : req.body.organizationId;
    },

    underscore: _
}
