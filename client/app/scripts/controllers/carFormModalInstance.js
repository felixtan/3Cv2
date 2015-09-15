'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarformmodalinstanceCtrl
 * @description
 * # CarformmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarFormModalInstanceCtrl', function (getDrivers, $http, $route, $scope, $modalInstance) {
    $scope.formData = {};
    $scope.drivers = getDrivers.data;

      $scope.submit = function () {
        $http.post('/api/cars', $scope.formData).then(function(car) {
          console.log('car created:',car);   

          // create ptg log for current week
          $http.post('/api/logs/cars/' + car.data.id, { 
            tlcNumber: car.data.tlcNumber,
            note: car.data.note
          }).then(function(log) {
            // if driver was assigned
            if($scope.formData.driverId) {
              $http.post('/api/assignments/driver=' +
                $scope.formData.driverId +
                '/car=' +
                car.data.id).then(function(data) {
                    console.log(data);
                    $scope.reset();        
                }, function(err) {
                    console.error(err);
                });
            } else {
              $scope.reset();        
            } 
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
        $route.reload();
        $modalInstance.dismiss('cancel');
      };
  });
