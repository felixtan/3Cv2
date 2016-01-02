'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CardataCtrl
 * @description
 * # CardataCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarDataCtrl', function ($q, carHelpers, $state, dataService, $scope, getCar, getCars, $modal) {   
    
    $scope.car = getCar.data;
    $scope.currentIdentifier = { name: $scope.car.identifier || null };
    $scope.identifier = { name: $scope.car.identifier || null };

    ///////////////////
    ///// Data UI /////
    ///////////////////

    var getFields = function(car) {
        $scope.fields = Object.keys($scope.car.data);
        return $scope.fields;
    }
    getFields();

    $scope.newFieldName = null;
    $scope.currentFieldName = null;
    $scope.checkFieldName = function(newName, currentName) {
        $scope.newFieldName = newName;
        $scope.currentFieldName = currentName;
    };

    $scope.fieldNameChanged = function() {
        if(($scope.newFieldName !== null) 
            && (typeof $scope.newFieldName !== 'undefined') 
            && ($scope.currentFieldName !== null) 
            && (typeof $scope.currentFieldName !== 'undefined') 
            && ($scope.currentFieldName !== $scope.newFieldName)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.newFieldVal = null;
    $scope.currentFieldVal = null;
    $scope.checkFieldValue = function(newVal, currentVal) {
        $scope.newFieldVal = newVal;
        $scope.currentFieldVal = currentVal;
    };

    $scope.fieldValChanged = function() {
        if(($scope.newFieldVal !== null) 
            && (typeof $scope.newFieldVal !== 'undefined') 
            && ($scope.currentFieldVal !== null) 
            && (typeof $scope.currentFieldVal !== 'undefined') 
            && ($scope.currentFieldVal !== $scope.newFieldVal)) { 
            return true;
        } else {
            return false;
        }
    };

    $scope.currentLogVal = null;
    $scope.newLogVal = null;
    $scope.checkLogValue = function(newVal, currentVal) {
        $scope.currentLogVal = currentVal;
        $scope.newLogVal = newVal;
    };

    $scope.logValChanged = function() {
        if(($scope.newLogVal !== null) 
            && (typeof $scope.newLogVal !== 'undefined') 
            && ($scope.currentLogVal !== null) 
            && (typeof $scope.currentLogVal !== 'undefined') 
            && ($scope.currentLogVal !== $scope.newLogVal)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.updateFieldName = function(car) {
        var deferred = $q.defer();
        car.data[$scope.newFieldName] = car.data[$scope.currentFieldName];
        delete car.data[$scope.currentFieldName];
        deferred.resolve(car);
        deferred.reject(new Error('Error updating car field name, id: ' + car.id));
        return deferred.promise;
    };

    $scope.updateLogVal = function(car) {
        var deferred = $q.defer();
        car.data[$scope.currentFieldName].log = $scope.newLogVal;
        deferred.resolve(car);
        deferred.reject(new Error('Error updating field log value'));
        return deferred.promise;
    };

    $scope.save = function (data, field) {
        // console.log('data:', data);
        // console.log('field:', field);
        var cars = getCars.data;

        ///////////////////////////////
        //// Update the scope car /////
        ///////////////////////////////

        if($scope.fieldNameChanged()) {
            $scope.updateFieldName($scope.car).then(function(car) {
                dataService.updateCar(car);
                $state.forceReload();
            });
        } else {
            dataService.updateCar($scope.car);
            $state.forceReload();
        }

        ///////////////////////////////
        //// Update other drivers /////
        ///////////////////////////////

        if($scope.fieldNameChanged()) {
            _.each(cars, function(car) {
                $scope.updateLogVal(car).then(function(carWithUpdatedLogVal) {
                    $scope.updateFieldName(carWithUpdatedLogVal).then(function(carWithUpdatedFieldName) {
                        dataService.updateCar(carWithUpdatedFieldName);
                    });
                });
            });
        } else if($scope.logValChanged() && !$scope.fieldNameChanged()) {
            _.each(cars, function(car) {
                $scope.updateLogVal(car).then(function(carWithUpdatedLogVal) {
                    dataService.updateCar(carWithUpdatedLogVal);
                });
            });
        } else {
            // do nothing
        }

        carHelpers.updateIdentifier(cars, $scope.currentIdentifier.name, $scope.identifier.name);
        $state.forceReload();
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