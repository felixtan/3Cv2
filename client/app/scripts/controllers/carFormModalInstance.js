'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarformmodalinstanceCtrl
 * @description
 * # CarformmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarFormModalInstanceCtrl', function ($state, getMaintenanceLogs, getDrivers, $http, $scope, $modalInstance) {
    $scope.formData = {};
    $scope.drivers = getDrivers.data;
    $scope.formData.dateInMs = getMaintenanceLogs.data.mostRecentDateInMs; 
    $scope.formData.date = new Date($scope.formData.dateInMs);

    $scope.submit = function () {
      $http.post('/api/cars', $scope.formData).then(function(car) {
        console.log('car created:',car);   
      }, function(err) {
          console.error(err);
      });
    };

    $scope.reset = function () {
      $scope.formData = {};
      $state.forceReload();
    };

    $scope.close = function () {
      $state.forceReload();
      $modalInstance.dismiss('cancel');
    };
  });
