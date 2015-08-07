'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, getCarsAndDrivers) {
    console.log(getCarsAndDrivers.data);
    $scope.cars = getCarsAndDrivers.data;
    
});
