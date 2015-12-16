'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DeletefieldmodalinstanceCtrl
 * @description
 * # DeletefieldmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DeleteFieldModalInstanceCtrl', function ($rootScope, getCars, thing, dataService, $scope, $modalInstance, $state) {
    $scope.input = '';
    $scope.cars = getCars.data;
    $scope.type = Object.keys(thing)[0];
    
    $scope.submit = function () {  
        if($scope.input === 'DELETE') {
            switch($scope.type) {
                case 'field': 
                    $scope.cars.forEach(function(car) {
                        delete car.data[thing[$scope.type]];
                        dataService.updateCar(car);
                    });
                    break;
                case 'log':
                    $scope.cars.forEach(function(car) {
                        car.logs.forEach(function(log) {
                            if(log.weekOf === thing[$scope.type]) {
                                car.logs.splice(car.logs.indexOf(log), 1);
                                dataService.updateCar(car);
                            }
                        });
                    });
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
