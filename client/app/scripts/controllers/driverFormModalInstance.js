'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DriverformmodalinstanceCtrl
 * @description
 * # DriverformmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DriverFormModalInstanceCtrl', function (getCars, $http, $route, $scope, $modalInstance) {
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
        $route.reload();
      };

      $scope.close = function () {
        $route.reset();
        $modalInstance.dismiss('cancel');
      };
  });
