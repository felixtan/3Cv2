'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddfieldmodalinstanceCtrl
 * @description
 * # AddfieldmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddFieldModalInstanceCtrl', function ($state, getCars, getDrivers, getProspects, $scope, $modalInstance, dataService) {
    
    $scope.formData = {};
    $scope.objects = [];
    $scope.objectType = null;
    $scope.update = function(object) { return; };

    if($state.includes('carProfile') || $state.includes('dashboard.cars')) {
      console.log("add field modal called from carProfile");
      $scope.objects = getCars.data;
      $scope.objectType = 'car';
      $scope.update = dataService.updateCar;
    } else if($state.includes('driverProfile') || $state.includes('dashboard.drivers')) {
      console.log("add field modal called from driverProfile");
      $scope.objects = getDrivers.data;
      $scope.objectType = 'driver';
      $scope.update = dataService.updateDriver;
    } else if($state.includes('prospectProfile') || $state.includes('dashboard.prospects')) {
      console.log("add field modal called from prospectProfile");
      $scope.objects = getProspects.data;
      $scope.objectType = 'prospect';
      $scope.update = dataService.updateProspect;
    } else {
      console.log('add field modal calle from invalid state', $state.current);
    }

    $scope.submit = function () {
        _.each($scope.objects, function(object) {
            
            // add field to each object
            object.data[$scope.formData.field] = {
                value: null,
                log: $scope.formData.log || false
            };
            
            // add field to each log
            if($scope.formData.log && ($scope.objectType != 'prospect')) {
                _.each(object.logs, function(log) {
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
