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
    // console.log($scope.car);
    $scope.cars = getCars.data;
    $scope.currentIdentifier = { name: $scope.car.identifier || null };
    $scope.identifier = { name: $scope.car.identifier || null };
    $scope.tabs = [
        { title: 'Data', active: true, state: 'carProfile.data({ id: car.id })' },
        { title: 'Logs', active: false, state: 'carProfile.logs({ id: car.id })' }
    ];

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

    $scope.addFieldToLogs = function(car, field) {
        var deferred = $q.defer();
        _.each(car.logs, function(log) {
            log.data[field] = null;    
        });
        deferred.resolve(car);
        deferred.reject(new Error('Error adding field to all logs'));
        return deferred.promise;
    };

    $scope.save = function (data, field) {
        // console.log('data:', data);
            // data.name -> updated field name
            // data.value -> updated field value
            // data.log -> updated field log

        if($scope.fieldNameChanged() && !$scope.logValChanged()) {
            _.each($scope.cars, function(car) {
                $scope.updateFieldName(car).then(function(carWithUpdatedFieldName) {
                    // console.log('saving:', carWithUpdatedFieldName);
                    dataService.updateCar(carWithUpdatedFieldName);
                    if(carWithUpdatedFieldName.id == $scope.car.id) $state.forceReload();
                });
            });
        } else if($scope.logValChanged() && !$scope.fieldNameChanged()) {
            _.each($scope.cars, function(car) {
                $scope.updateLogVal(car).then(function(carWithUpdatedLogVal) {
                    $scope.addFieldToLogs(carWithUpdatedLogVal, data.name).then(function(carWithUpdatedLogs) {
                        // console.log('saving:', carWithUpdatedLogs);
                        dataService.updateCar(carWithUpdatedLogs);
                        if(carWithUpdatedLogs.id == $scope.car.id) $state.forceReload();
                    });
                });
            });
        } else if($scope.logValChanged() && $scope.fieldNameChanged()) {
            _.each($scope.cars, function(car) {
               $scope.updateLogVal(car).then(function(carWithUpdatedLogVal) {
                    $scope.addFieldToLogs(carWithUpdatedLogVal, data.name).then(function(carWithUpdatedLogs) {
                        $scope.updateFieldName(carWithUpdatedLogs).then(function(carWithUpdatedFieldName) {
                            // console.log('saving:', carWithUpdatedFieldName);
                            dataService.updateCar(carWithUpdatedFieldName);
                            if(carWithUpdatedFieldName.id == $scope.car.id) $state.forceReload();
                        });
                    });
                });
            });
        } else {
            dataService.updateCar($scope.car);
            $state.forceReload();
        }

        carHelpers.updateIdentifier($scope.cars, $scope.currentIdentifier.name, $scope.identifier.name);
    };

    // Add field
    // Add field
    $scope.addField = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/addfieldmodal.html',
            controller: 'AddFieldModalInstanceCtrl',
            size: 'md',
            resolve: {
                getCars: function(dataService) {
                    return (($state.includes('carProfile') || $state.includes('dashboard.cars')) ? dataService.getCars() : {});
                },
                getDrivers: function(dataService) {
                    return (($state.includes('driverProfile') || $state.includes('dashboard.drivers')) ? dataService.getDrivers() : {});
                },
                getProspects: function(dataService) {
                    return (($state.includes('prospectProfile') || $state.includes('dashboard.prospects')) ? dataService.getProspects() : {});  
                },
                getAssets: function(dataService) {
                    return (($state.includes('assetProfile') || $state.includes('dashboard.assets')) ? dataService.getAssets() : {});
                },
                assetType: function() {
                    return null;
                }
            }
        });

        modalInstance.result.then(function (newField) {
            $scope.newField = newField;
            $state.forceReload();
        }, function() {
            $state.forceReload();
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    /////////////////////////////
    // Driver Assignment UI /////
    /////////////////////////////

    $scope.assign = function (objectType) {

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
                },
                subjectType: function() {
                    return "car";
                },
                objectType: function() {
                    return objectType;
                }
            }
        });

        modalInstance.result.then(function (input) {
            console.log('passed back from AssignmentModalCtrl:', input);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    // Expression
    $scope.validateExpression = function(data, field) {
        console.log(data);
        console.log(field);
    };

    $scope.buildExpression = function(expressionItems) {
        var expression = '';
        _.each(expressionItems, function(item) {
            expression = expression + item.value;
        });

        return expression;
    };

    $scope.editExpression = function(object, field) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/editExpressionModal.html',
            controller: 'EditExpressionModalCtrl',
            size: 'md',
            resolve: {
                field: function() {
                    return field;
                },
                object: function() {
                    return object;
                },
                objectType: function() {
                    return 'car';
                },
                getCars: function(dataService) {
                    return dataService.getCars();
                },
                getProspects: function() {
                    return;
                },
                getDrivers: function() {
                    return;
                },
                getAssets: function() {
                    return;
                }
            }
        });

        modalInstance.result.then(function (input) {
            console.log('passed back from EditExpressionModalCtrl:', input);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });