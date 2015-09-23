'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DriverformmodalinstanceCtrl
 * @description
 * # DriverformmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DriverFormModalInstanceCtrl', function ($state, getCars, $http, $scope, $modalInstance) {
    $scope.formData = {};
    $scope.cars = getCars.data;    

    
    $scope.submit = function () {
        
      // Formatting
      if($scope.formData.middleInitial) $scope.formData.middleInitial = $scope.formData.middleInitial.toUpperCase();
      $scope.formData.givenName = $scope.formData.givenName.charAt(0).toUpperCase() + $scope.formData.givenName.substr(1).toLowerCase();
      $scope.formData.surName = $scope.formData.surName.charAt(0).toUpperCase() + $scope.formData.surName.substr(1).toLowerCase();
      $scope.formData.payRate = $scope.formData.payRate.toString();

      $http.post('/api/drivers', $scope.formData)
          .then(function(driver) {
              $scope.reset();   
          }, function(err) {
              console.error(err);
          });
    };

    $scope.reset = function () {
      $scope.formData = {};
      $scope.driverForm.$setPristine();
      $scope.driverForm.$setUntouched();
      $state.forceReload();
    };

    $scope.close = function () {
      $modalInstance.dismiss('cancel');
    };
  });
