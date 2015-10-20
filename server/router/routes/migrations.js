'use strict';
var getUserId = require('../helpers').getUserId;

module.exports = {
    drivers: function(req, res) {
        getUserId(req).then(function(organizationId) {
            var umzug = req.app.settings.umzug;
            
            umzug.execute({

            }).then(function(result) {
                
            });
        });
    }
}