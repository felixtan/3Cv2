'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarstatuslogsCtrl
 * @description
 * # CarstatuslogsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('maintenanceLogsCtrl', function ($route, $http, getCarsWithLogs, basicCarData) {
    this.logs = getCarsWithLogs.data.logs;
    this.mostRecentDateInMs = getCarsWithLogs.data.mostRecentDateInMs;
    this.cars = basicCarData.data;
    // console.log(getCarsWithLogs.data);
    const oneWeekInMs = 604800000;

    this.newLog = function() {
        var newDateInMs = this.mostRecentDateInMs + oneWeekInMs;
        var date = new Date(newDateInMs);

        $http.post('/api/logs/cars', {
            date: date,
            dateInMs: newDateInMs
        }).then(function() {
            console.log('New maintenance log created.');
            setTimeout(function() { $route.reload(); }, 1000);
        }).catch(function(err) {
            console.log(err);
        });
    };

    this.updateLog = function(car) {
        $http.put('/api/logs/cars/' + car.id, {
            mileage: car.mileage,
            note: car.note
        }).success(function(data) {
            console.log('Maintenance log updated.');
        }).error(function(err) {
            console.error(err);
        });
    };

  });
