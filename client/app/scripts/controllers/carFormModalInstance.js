'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarformmodalinstanceCtrl
 * @description
 * # CarformmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('carFormModalInstanceCtrl', function (getDrivers, $http, $route, $scope, $modalInstance) {
    $scope.formData = {};
    $scope.drivers = getDrivers.data;

      $scope.submit = function () {
        console.log('creating car:',$scope.formData);
        $http.post('/api/cars', $scope.formData)
            .then(function(car) {
                console.log('car created:',car);    
                $http.post('/api/assignments/driver=' +
                    $scope.formData.driverId +
                    '/car=' +
                    car.data.id).then(function(data) {
                        console.log(data);
                        $scope.reset();        
                    }, function(err) {
                        console.error(err);
                    });
            }, function(err) {
                console.error(err);
            });
      };

      $scope.reset = function () {
        $scope.formData = {};
        $route.reload();
      };

      $scope.close = function () {
        $modalInstance.dismiss('cancel');
      };
  });
