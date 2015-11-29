'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DeletefieldmodalinstanceCtrl
 * @description
 * # DeletefieldmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DeleteFieldModalInstanceCtrl', function (getCars, thing, dataService, $scope, $modalInstance, $state) {
    $scope.input = '';
    $scope.cars = getCars.data;
    $scope.type = Object.keys(thing)[0];
    
    $scope.submit = function () {  
        if($scope.input === 'DELETE') {
            switch($scope.type) {
                case 'field': 
                    $scope.cars.forEach(function(car) {
                        delete car.data[thing[$scope.type]];
                        dataService.updateCar(car, { updateCarData: true });
                    });
                    break;
                case 'log':
                    $scope.cars.forEach(function(car) {
                        var log = _.filter(car.logs, function(log) {
                            return log.weekOf === thing[$scope.type];
                        })[0];
                        var index = _.indexOf(car.logs, log);
                        car.logs.splice(index,1);
                        dataService.updateCar(car, { updateCarData: true });
                    });
                    break;
                default:
                    console.error('Invalid delete');
            }
            
        }
            // delete the field from all cars data but not from logs
        $scope.close();
    }

    $scope.close = function () {
        $state.forceReload();
        $modalInstance.dismiss('cancel');
    }
  });
