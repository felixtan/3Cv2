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

    // Editable rows


  });
