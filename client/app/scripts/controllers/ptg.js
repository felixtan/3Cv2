'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:PtgCtrl
 * @description
 * # PtgCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('PtgCtrl', function ($route, ptgViewData, basicDriverData, $http) {

    this.logs = ptgViewData.data.logs; 
    this.mostRecentDateInMs = ptgViewData.data.mostRecentDateInMs;
    this.drivers = basicDriverData.data;

    const oneWeekInMs = 604800000;

    this.newLog = function() {
        var newDateInMs = this.mostRecentDateInMs + oneWeekInMs; 
        var date = new Date(newDateInMs);

        $http.post('/api/logs/ptg', {
            dateInMs: newDateInMs,
            date: date
        }).then(function() {
            console.log('New PTG log created.');
            setTimeout(function() { $route.reload(); }, 1000);
        }).catch(function(err) {
            console.error(err);
        });
    };

     this.updateLog = function(driver) {
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
    };


  });
