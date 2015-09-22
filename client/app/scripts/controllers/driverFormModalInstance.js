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
        console.log('creating driver:',$scope.formData);
        $http.post('/api/drivers', $scope.formData)
            .then(function(driver) {
                console.log('driver created:', driver); 
                $scope.reset();   
            }, function(err) {
                console.error(err);
            });
      };

      $scope.reset = function () {
        $scope.formData = {};
        $state.forceReload();
      };

      $scope.close = function () {
        $scope.reset();
        $modalInstance.dismiss('cancel');
      };
  });
