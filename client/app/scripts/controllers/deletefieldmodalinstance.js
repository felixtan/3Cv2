'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DeletefieldmodalinstanceCtrl
 * @description
 * # DeletefieldmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DeleteFieldModalInstanceCtrl', function ($rootScope, getDrivers, getCars, thing, dataService, $scope, $modalInstance, $state) {
    $scope.input = '';
    $scope.type = Object.keys(thing)[0];

    // determine the state or ui calling this modal
    if($state.includes('dashboard.drivers')) {
        console.log('called from drivers ui');
        $scope.objects = getDrivers.data;
        $scope.update = dataService.updateDriver;
    } else if($state.includes('dashboard.cars')) {
        console.log('called from cars ui');
        $scope.objects = getCars.data;
        $scope.update = dataService.updateCar;
    }
    
    $scope.submit = function () {  
        // assumes car, driver, etc. have the same schema structure
        if($scope.input === 'DELETE') {
            switch($scope.type) {
                case 'field': 
                    if($scope.objects.length > 0) {
                        $scope.objects.forEach(function(obj) {
                            delete obj.data[thing[$scope.type]];
                            $scope.update(obj);
                        });
                    }
                    break;
                case 'log':
                    if($scope.objects.length > 0) {
                        $scope.objects.forEach(function(obj) {
                            obj.logs.forEach(function(log) {
                                if(log.weekOf === thing[$scope.type]) {
                                    obj.logs.splice(obj.logs.indexOf(log), 1);
                                    $scope.update(obj);
                                }
                            });
                        });
                    }
                    break;
                default:
                    console.error('Invalid delete');
            }

            $scope.ok();
        }
    }

    $scope.ok = function() {
        // send the deleted field back
        $modalInstance.close(thing[$scope.type]);
        $state.forceReload();
    }

    $scope.close = function () {
        $state.forceReload();
        $modalInstance.dismiss('cancel');
    }
  });
