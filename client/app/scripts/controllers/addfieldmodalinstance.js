'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddfieldmodalinstanceCtrl
 * @description
 * # AddfieldmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddFieldModalInstanceCtrl', function ($state, getCars, getDrivers, $scope, $modalInstance, dataService) {
    
    $scope.formData = {};
    $scope.objects = [];
    $scope.update = function(object) { return; };

    if($state.includes('carProfile')) {
      console.log("add field modal called from carProfile");
      $scope.objects = getCars.data;
      $scope.update = dataService.updateCar;
    } else if($state.includes('driverProfile')) {
      console.log("add field modal called from driverProfile");
      $scope.objects = getDrivers.data;
      $scope.update = dataService.updateDriver;
    } else {
      console.log('add field modal calle from invalid state', $state.current);
    }

    $scope.submit = function () {
        $scope.objects.forEach(function(object) {
            object.data[$scope.formData.field] = {
                value: null,
                log: $scope.formData.log
            }
            
            if($scope.formData.log) {
                object.logs.forEach(function(log) {
                    log.data[$scope.formData.field] = null;
                });
            }

            $scope.update(object);
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
