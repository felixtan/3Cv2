'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:PtgCtrl
 * @description
 * # PtgCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('PtgCtrl', function (ptgViewData, basicDriverData, $http) {
    this.logs = ptgViewData.data.logs; 
    this.mostRecentDateInMs = ptgViewData.data.mostRecentDateInMs;
    this.drivers = basicDriverData.data;
    const oneWeekInMs = 604800000;

    console.log(this.logs);

    this.newLog = function() {
        var newDateInMs = this.mostRecentDateInMs + oneWeekInMs; 
        $http.post('/api/logs/ptg', {
            dateInMs: newDateInMs,
            date: new Date(newDateInMs)
        }).success(function(data) {
            console.log('New PTG log created.');
        }).error(function(err) {
            console.error(err);
        });
    };

    this.updateLog = function(driver) {
        console.log(driver);
        $http.put('/api/logs/drivers/' + driver.id, {
            uberRevenue: driver.uberRevenue,
            tollCosts: driver.tollCosts,
            gasCosts: driver.gasCosts,
            deposit: driver.deposit,
            hours: driver.hours,
            acceptRate: driver.acceptRate,
            payout: driver.payout
        }).success(function(data) {
            console.log('PTG log updated.');
        }).error(function(err) {
            console.error(err);
        });
    }


  });
