'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DriversuiCtrl
 * @description
 * # DriversuiCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DriversUICtrl', function (getDrivers, $scope, $modal) {

    $scope.drivers = getDrivers.data;

    $scope.thereAreDrivers = function() {
      return (typeof $scope.drivers[0] !== 'undefined');
    };
  });
