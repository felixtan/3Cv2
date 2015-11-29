'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddfieldmodalinstanceCtrl
 * @description
 * # AddfieldmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddFieldModalInstanceCtrl', function ($state, getCars, $scope, $modalInstance, dataService) {
    $scope.formData = {};
    $scope.cars = getCars.data;

    $scope.submit = function () {
        $scope.cars.forEach(function(car) {
            car.data[$scope.formData.field] = {
                value: null,
                log: $scope.formData.log
            }
            
            if($scope.formData.log) {
                car.logs.forEach(function(log) {
                    log.data[$scope.formData.field] = null;
                });
            }

            dataService.updateCar(car, { updateCarData: true });
        });

        $scope.close();
    }

    $scope.reset = function () {
      $scope.formData = {};
      $scope.form.$setPristine();
      $scope.form.$setUntouched();
      $state.forceReload();
    }

    $scope.close = function () {
        $state.forceReload();
        $modalInstance.dismiss('cancel');
    }
  });
