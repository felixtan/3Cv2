'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CardataCtrl
 * @description
 * # CardataCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarDataCtrl', function (carHelpers, $state, dataService, $scope, getCar, getCars, $modal) {
    // var _ = underscore._;     
    $scope.car = getCar.data;
    $scope.oldField = '';
    $scope.currentIdentifier = { name: $scope.car.identifier || null };
    $scope.identifier = { name: $scope.car.identifier || null };

    // Read
    var getFields = function(car) {
        $scope.fields = Object.keys($scope.car.data);
        return $scope.fields;
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
        console.log(data);
        var newField = data.name;
        $scope.cars = getCars.data;
        var logVal = data.log;

        // update current car
        (function() {
            delete $scope.car.data[$scope.oldField];
            $scope.car.data[newField] = { value: data.value, log: data.log };
            dataService.updateCar($scope.car);
        })();

        $scope.cars.forEach(function(car) {
            if(car.id !== $scope.car.id) {
                var value = car.data[$scope.oldField].value;
                car.data[newField] = { value: value, log: logVal };
                if ($scope.oldField !== newField) delete car.data[$scope.oldField];
                dataService.updateCar(car);
            }
        });

        carHelpers.updateIdentifier($scope.cars, $scope.currentIdentifier.name, $scope.identifier.name);
    };

    /////////////////////////////
    // Driver Assignment UI /////
    /////////////////////////////
    $scope.assign = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/assignmentmodal.html',
            controller: 'AssignmentModalCtrl',
            size: 'md',
            resolve: {
                getDrivers: function(dataService) {
                    return dataService.getDrivers();
                },
                getCars: function() {
                    return {};
                },
                driver: function() {
                    return {};
                },
                car: function() {
                    return $scope.car;
                }
            }
        });

        modalInstance.result.then(function (input) {
            console.log('passed back from AssignmentModalCtrl:', input);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });