var Promise = require('bluebird');

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
    }
}
