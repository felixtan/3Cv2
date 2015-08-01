var expect = require('chai').expect;
var nock = require('nock');
var models = require('../db/models');
var driver = models.Driver;
// var driverLog = models.DriverLog;
var driverLog = require('../router/routes/driverlogs');

describe('Driver log api tests', function() {

    // Best practice: 
    // Clear the db before each test case. 
    // Tests should not share data.
    beforeEach(function(done) {
        // models.sequelize.sync({ force: true }).then(function(err) {
        //     if (err)
        //         done(err);
        //     else
        //         done();
        // });
        done();
    });

    it("should list all driver logs", function(done) {
        nock('http://localhost:3000')
            .get('/api/logs/drivers')
            .set('Accept', 'application/json')
            .reply(200, 'OK');
        driverLog.getDriversLogs(function(err, res) {
            expect(res).to.eql({});
            done();
        });
    });
});