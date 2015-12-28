'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DriverprofileCtrl
 * @description
 * # DriverprofileCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DriverProfileCtrl', function ($scope, getDriver, getDrivers) {
    $scope.getDriver = function() {
        $scope.driver = getDriver.data;
    };
    $scope.getDriver();
  });
