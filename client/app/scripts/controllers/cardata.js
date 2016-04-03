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
    
    // $scope.test = $scope.$eval("2 / 3");
    var self = this;        // for testing;
    $scope.car = getCar.data;
    // console.log($scope.car);
    $scope.cars = $scope.objects = getCars.data;
    $scope.objectType = 'car';
    $scope.assetType = { value: null };

    // TODO: see instead of having two variables, can use one and ng-change
    $scope.currentIdentifier = { name: $scope.car.identifier || null };
    $scope.newIdentifier = { name: $scope.car.identifier || null };

    $scope.tabs = [
        { title: 'Data', active: true, state: 'carProfile.data({ id: car.id })' },
        { title: 'Logs', active: false, state: 'carProfile.logs({ id: car.id })' }
    ];

    ///////////////////
    ///// Data UI /////
    ///////////////////

    // self.getFields = function(car) {
    //     $scope.fields = Object.keys($scope.car.data);
    //     return $scope.fields;
    // };
    // self.getFields();


    /* 
    TODO: move all variables not used in the view from under $scope to under this
        so that they're not exposed to the client but still testable
        
        http://stackoverflow.com/questions/22921484/how-can-we-test-non-scope-angular-controller-methods
    
        Such variables
        --------------
        $scope.newFieldName
        $scope.currentFieldName
        $scope.newFieldVal
        $scope.currentFieldVal
        $scope.currentLogVal
        $scope.newLogVal
        $scope.updateFieldName 
        $scope.updateLogVal
        $scope.addFieldToLogs
    */

    $scope.checkIdentifier = function(newIdentifier, currentIdentifier) {
        $scope.newIdentifier.name = newIdentifier;
        $scope.currentIdentifier.name = currentIdentifier;
    };

    $scope.identifierChanged = function() {
        if(($scope.newIdentifier.name !== null) 
            && (typeof $scope.newIdentifier.name !== 'undefined') 
            && ($scope.currentIdentifier.name !== null) 
            && (typeof $scope.currentIdentifier.name !== 'undefined') 
            && ($scope.currentIdentifier.name !== $scope.newIdentifier.name)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.newFieldName = null;
    $scope.currentFieldName = null;
    $scope.checkFieldName = function(newName, currentName) {
        // console.log(newName);
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
        if(car.identifier === $scope.currentFieldName) car.identifier = $scope.newFieldName;
        car.data[$scope.newFieldName] = car.data[$scope.currentFieldName];
        delete car.data[$scope.currentFieldName];
        deferred.resolve(car);
        deferred.reject(new Error('Error updating car field name, id: ' + car.id));
        return deferred.promise;
    };

    $scope.updateLogVal = function(car) {
        var deferred = $q.defer();
        car.data[$scope.currentFieldName].log = $scope.newLogVal;
        $scope.addFieldToLogs(car, $scope.currentFieldName).then(function(carWithUpdatedLogs) {
            // console.log('car with updated log values:', carWithUpdatedLogs);
            deferred.resolve(carWithUpdatedLogs);
            deferred.reject(new Error('Error updating field log value'));
        });
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

    $scope.updateIdentifier = function(car) {
        var deferred = $q.defer();
        car.identifier = $scope.fieldNameChanged() ? $scope.newFieldName : $scope.newIdentifier.name;
        deferred.resolve(car);
        deferred.reject(new Error('Error updating identifier'));
        return deferred.promise;
    };

    $scope.save = function(data) {
        // console.log($scope.currentFieldVal);
        // console.log($scope.newFieldVal);
        // console.log($scope.currentFieldName);
        // console.log($scope.newFieldName);
        // console.log($scope.currentLogVal);
        // console.log($scope.newLogVal);
        // console.log($scope.currentIdentifier.name);
        // console.log($scope.newIdentifier.name);

        // console.log('data:', data);
            // data.name -> updated field name
            // data.value -> updated field value
            // data.log -> updated field log

        // bug detected: if everything changes, value for present car won't be updated
        // fix: process current car first then other cars, skipping the current car during the _.each

        // bug detected: if both field name and identifier is changed to that field then identifier might become undefined
        // fix: make sure identifier is being set to the new field name

        if($scope.fieldValChanged()) {
            if($scope.logValChanged()) {
                if($scope.fieldNameChanged()) {
                    if($scope.identifierChanged()) {
                        // console.log('all changed');
                        // 1111
                        _.each($scope.cars, function(car) {
                            $scope.updateIdentifier(car).then(function(carUpdated1) {
                                // console.log(carUpdated1);
                                $scope.updateLogVal(carUpdated1).then(function(carUpdated2) {
                                    // console.log(carUpdated2);
                                    $scope.updateFieldName(carUpdated2).then(function(carUpdated3) {
                                        if(carUpdated3.id === $scope.car.id) carUpdated3.data[$scope.newFieldName].value = $scope.newFieldVal;
                                        // console.log('hail mary', carUpdated3);
                                        dataService.updateCar(carUpdated3);
                                    });
                                });
                            });
                        });
                    } else {
                        // 1110
                        _.each($scope.cars, function(car) {
                            $scope.updateLogVal(car).then(function(carUpdated1) {
                                $scope.updateFieldName(carUpdated1).then(function(carUpdated2) {
                                    if(carUpdated2.id === $scope.car.id) carUpdated2.data[$scope.newFieldName].value = $scope.newFieldVal;
                                    dataService.updateCar(carUpdated2);
                                });
                            });
                        });
                    }
                } else {
                    if($scope.identifierChanged()) {
                        // 1101
                        _.each($scope.cars, function(car) {
                            $scope.updateIdentifier(car).then(function(carUpdated1) {
                                $scope.updateLogVal(carUpdated1).then(function(carUpdated2) {
                                    if(carUpdated2.id === $scope.car.id) carUpdated2.data[$scope.currentFieldName].value = $scope.newFieldVal;
                                    dataService.updateCar(carUpdated2);
                                });
                            });
                        });
                    } else {
                        // 1100
                        _.each($scope.cars, function(car) {
                            $scope.updateLogVal(car).then(function(carUpdated1) {
                                if(carUpdated1.id === $scope.car.id) carUpdated1.data[$scope.currentFieldName].value = $scope.newFieldVal;
                                dataService.updateCar(carUpdated1);
                            });
                        });
                    }
                }
            } else {
                if($scope.fieldNameChanged()) {
                    if($scope.identifierChanged()) {
                        // 1011
                        _.each($scope.cars, function(car) {
                            $scope.updateIdentifier(car).then(function(carUpdated1) {
                                $scope.updateFieldName(carUpdated1).then(function(carUpdated2) {
                                    if(carUpdated2.id === $scope.car.id) carUpdated2.data[$scope.newFieldName].value = $scope.newFieldVal;
                                    dataService.updateCar(carUpdated2);
                                });
                            });
                        });
                    } else {
                        // 1010
                        _.each($scope.cars, function(car) {
                            $scope.updateFieldName(car).then(function(carUpdated1) {
                                if(carUpdated1.id === $scope.car.id) carUpdated1.data[$scope.newFieldName].value = $scope.newFieldVal;
                                dataService.updateCar(carUpdated1);
                            });
                        });
                    }
                } else {
                    if($scope.identifierChanged()) {
                        // 1001
                        _.each($scope.cars, function(car) {
                            $scope.updateIdentifier(car).then(function(carUpdated1) {
                                if(carUpdated1.id === $scope.car.id) carUpdated1.data[$scope.currentFieldName].value = $scope.newFieldVal;
                                dataService.updateCar(carUpdated1);
                            });
                        });
                    } else {
                        // 1000
                        dataService.updateCar($scope.car);
                    }
                }
            }
        } else {
            if($scope.logValChanged()) {
                if($scope.fieldNameChanged()) {
                    if($scope.identifierChanged()) {
                        // 0111
                        _.each($scope.cars, function(car) {
                            $scope.updateIdentifier(car).then(function(carUpdated1) {
                                $scope.updateLogVal(carUpdated1).then(function(carUpdated2) {
                                    $scope.updateFieldName(carUpdated2).then(function(carUpdated3) {
                                        dataService.updateCar(carUpdated3);
                                    });
                                });
                            });
                        });
                    } else {
                        // 0110
                        _.each($scope.cars, function(car) {
                            $scope.updateLogVal(car).then(function(carUpdated1) {
                                $scope.updateFieldName(carUpdated1).then(function(carUpdated2) {
                                    dataService.updateCar(carUpdated2);
                                });
                            });
                        });
                    }
                } else {
                    if($scope.identifierChanged()) {
                        // 0101
                        _.each($scope.cars, function(car) {
                            $scope.updateIdentifier(car).then(function(carUpdated1) {
                                $scope.updateLogVal(carUpdated1).then(function(carUpdated2) {
                                    dataService.updateCar(carUpdated2);
                                });
                            });
                        });
                    } else {
                        // 0100
                        _.each($scope.cars, function(car) {
                            $scope.updateLogVal(car).then(function(carUpdated1) {
                                dataService.updateCar(carUpdated1);
                            });
                        });
                    }
                }
            } else {
                if($scope.fieldNameChanged()) {
                    if($scope.identifierChanged()) {
                        // 0011
                        _.each($scope.cars, function(car) {
                            $scope.updateIdentifier(car).then(function(carUpdated1) {
                                $scope.updateFieldName(carUpdated1).then(function(carUpdated2) {
                                    dataService.updateCar(carUpdated2);
                                });
                            });
                        });
                    } else {
                        // 0010
                        _.each($scope.cars, function(car) {
                            $scope.updateFieldName(car).then(function(carUpdated1) {
                                dataService.updateCar(carUpdated1);
                            });
                        });
                    }
                } else {
                    if($scope.identifierChanged()) {
                        // 0001
                        // console.log("update identifier only");
                        _.each($scope.cars, function(car) {
                            $scope.updateIdentifier(car).then(function(carUpdated1) {
                                dataService.updateCar(carUpdated1);
                            });
                        });
                    } else {
                        // 0000
                    }
                }
            }
        }
    };

    // Add field
    $scope.addField = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/addfieldmodal.html',
            controller: 'AddFieldModalInstanceCtrl',
            size: 'md',
            resolve: {
                getCars: function(dataService) {
                    return ($scope.objectType === 'car') ? $scope.objects : {};
                },
                getDrivers: function(dataService) {
                    return ($scope.objectType === 'driver') ? $scope.objects : {};
                },
                getProspects: function(dataService) {
                    return ($scope.objectType === 'prospect') ? $scope.objects : {};  
                },
                getAssets: function(dataService) {
                    return {
                        data: ($scope.objectType === 'asset') ? $scope.objects : {},
                        type: $scope.assetType.value
                    };
                },
                assetType: function() {
                    return $scope.objectType === 'asset' ? assetType : null;
                },
                objectType: function() {
                    return $scope.objectType;
                }
            }
        });

        modalInstance.result.then(function (newField) {
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
        // console.log(data);
        // console.log(field);
    };

    $scope.buildExpression = function(expressionItems) {
        var expression = '';
        _.each(expressionItems, function(item) {
            expression = expression + item.value;
        });

        return expression;
    };

    $scope.editField = function(object, field) {
        // console.log(object);
        // console.log(field);
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/editFieldModal.html',
            controller: 'EditFieldModalCtrl',
            size: 'md',
            resolve: {
                field: function() {
                    return field;
                },
                _object: function() {
                    return object;
                },
                objectType: function() {
                    return $scope.objectType;
                },
                getCars: function() {
                    // console.log($scope.objects);
                    return $scope.objectType === 'car' ? $scope.objects : null;
                },
                getProspects: function() {
                    return $scope.objectType === 'prospect' ? $scope.objects : null;
                },
                getDrivers: function() {
                    return $scope.objectType === 'driver' ? $scope.objects : null;
                },
                getAssets: function() {
                    return $scope.objectType === 'asset' ? $scope.objects : null;
                }
            }
        });

        modalInstance.result.then(function () {
            // console.log('passed back from EditFieldModalCtrl:', input);
            $state.forceReload();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
            $state.forceReload();
        });
    };
  });