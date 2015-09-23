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

      // Formatting
      $scope.formData.licensePlateNumber = $scope.formData.licensePlateNumber.toUpperCase();

      $http.post('/api/cars', $scope.formData).then(function(car) {
        $scope.reset();  
      }, function(err) {
          console.error(err);
      });
    };

    $scope.reset = function () {
      $scope.formData = {};
      $scope.carForm.$setPristine();
      $scope.carForm.$setUntouched();
      $state.forceReload();
    };

    $scope.close = function () {
      $state.forceReload();
      $modalInstance.dismiss('cancel');
    };
  });
