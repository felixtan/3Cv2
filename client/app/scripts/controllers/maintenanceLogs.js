/**
 * @ngdoc function
 * @name clientApp.controller:CarstatuslogsCtrl
 * @description
 * # CarstatuslogsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MaintenanceLogsCtrl', function ($state, $http, getMaintenanceLogs, basicCarData) {
    this.logs = getMaintenanceLogs.data.logs;
    this.mostRecentDateInMs = getMaintenanceLogs.data.mostRecentDateInMs;
    this.cars = basicCarData.data;

    // causes error when 'use strict'
    const oneWeekInMs = 604800000;

    this.newLog = function() {
        var newDateInMs = this.mostRecentDateInMs + oneWeekInMs;
        var date = new Date(newDateInMs);

        $http.post('/api/logs/maintenance', {
            date: date,
            dateInMs: newDateInMs
        }).then(function() {
            setTimeout(function() { $state.forceReload(); }, 1000);
        }).catch(function(err) {
            console.error(err);
        });
    };

    this.updateLog = function(car) {
        $http.put('/api/logs/cars/' + car.id, {
            mileage: car.mileage,
            note: car.note,
            tlcNumber: car.tlcNumber
        }).success(function() {
        }).error(function(err) {
            console.error(err);
        });
    };

  });
