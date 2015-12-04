'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CardataCtrl
 * @description
 * # CardataCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarDataCtrl', function ($state, $filter, $window, dataService, $q, $scope, getCar, getCars) {

    let _ = $window._;
    $scope.upToDateFields = [];
    $scope.car = getCar.data;
    $scope.oldField = '';
    
    // for view
    let getFields = function(car) {
        $scope.fields = _.keys($scope.car.data);
        return _.keys(car);
    }
    getFields();

    // Delete
    // handled by DeleteFieldModalCtrl

    // remember that added fields, updated fields, deleted fields, and logged fields must apply to all cars

    // Create
    // handled by AddFieldModalCtrl

    // editable row onbeforesave methods
    $scope.nameChanged = function(newVal, oldVal) {
        $scope.oldField = oldVal;
    }

    // Update
    $scope.save = function (data) {
        let newField = data.name;
        let cars = getCars.data;
        let logVal = data.log;
        console.log('new:', newField);
        console.log('old:',$scope.oldField);

        // update current car
        (function() {
            delete $scope.car.data[$scope.oldField];
            $scope.car.data[newField] = { value: data.value, log: data.log };
            dataService.updateCar($scope.car, { updateCarData: true });
        })();

        _.each(cars, function(car) {
            if(car.id !== $scope.car.id) {
                let value = car.data[$scope.oldField].value;
                car.data[newField] = { value: value, log: logVal };
                if ($scope.oldField !== newField) delete car.data[$scope.oldField];
                dataService.updateCar(car, { updateCarData: true });
            }
        });
    }

  });
