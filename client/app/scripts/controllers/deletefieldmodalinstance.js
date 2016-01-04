'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DeletefieldmodalinstanceCtrl
 * @description
 * # DeletefieldmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DeleteFieldModalInstanceCtrl', function (getProspects, getDrivers, getCars, thing, dataService, $scope, $modalInstance, $state) {
    $scope.input = null;
    $scope.type = Object.keys(thing)[0];
    $scope.value = thing[$scope.type];
    $scope.objects = [];
    $scope.objectType = '';
    $scope.update = function(object) { return; };

    // determine the state or ui calling this modal
    if($state.includes('driverProfile') || $state.includes('dashboard.drivers')) {
        console.log('called from drivers ui');
        $scope.objectType = 'driver';
        $scope.objects = getDrivers.data;
        $scope.update = dataService.updateDriver;
    } else if($state.includes('carProfile') || $state.includes('dashboard.cars')) {
        console.log('called from cars ui');
        $scope.objectType = 'car';
        $scope.objects = getCars.data;
        $scope.update = dataService.updateCar;
    } else if($state.includes('prospectProfile') || $state.includes('dashboard.prospects')) {
        console.log('called from prospects ui');
        $scope.objectType = 'prospect';
        $scope.objects = getProspects.data;
        $scope.update = dataService.updateProspect;
    } else {
        console.log('delete field modal calle from invalid state', $state.current);
    }

    $scope.submit = function () {  
        // assumes car, driver, etc. have the same schema structure
        if($scope.input === 'DELETE') {
            switch($scope.type) {
                case 'field': 
                    if($scope.objects.length > 0) {
                        $scope.objects.forEach(function(obj) {
                            delete obj.data[$scope.value];
                            $scope.update(obj);
                            // TODO: What to do with logs containing this field?
                        });
                    }
                    break;
                case 'log':
                    if($scope.objects.length > 0) {
                        $scope.objects.forEach(function(obj) {
                            obj.logs.forEach(function(log) {
                                if(log.weekOf === $scope.value) {
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
        $state.forceReload();
        $modalInstance.close(thing[$scope.type]);
    };

    $scope.close = function () {
        $state.forceReload();
        $modalInstance.dismiss('cancel');
    };
  });
