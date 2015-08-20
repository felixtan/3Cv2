'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarstatuslogsCtrl
 * @description
 * # CarstatuslogsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('carStatusLogsCtrl', function (getCarsWithLogs, basicCarData) {
    this.logs = getCarsWithLogs.data.logs;
    this.mostRecentDateInMs = getCarsWithLogs.data.mostRecentDateInMs;
    this.cars = basicCarData.data;

    const oneWeekInMs = 604800000;
    
    console.log(this.logs);
  });
