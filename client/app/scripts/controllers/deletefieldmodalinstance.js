'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DeletefieldmodalinstanceCtrl
 * @description
 * # DeletefieldmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DeleteFieldModalInstanceCtrl', function (objectHelpers, $q, getAssets, getProspects, getDrivers, getCars, objectType, thing, dataService, $scope, $modalInstance, $state) {
    
    var ctrl = this;
    $scope.confirmation = { value: "" };
    $scope.objects = [];
    $scope.objectType = objectType;
    $scope.update = null;
    $scope.thing = thing;

    // determine the state or ui calling this modal
    if($scope.objectType === 'driver') {
        // console.log('called from drivers ui');
        $scope.objectType = 'driver';
        $scope.objects = getDrivers;
        $scope.update = dataService.updateDriver;
    } else if($scope.objectType === 'car') {
        // console.log('called from cars ui');
        $scope.objectType = 'car';
        $scope.objects = getCars;
        $scope.update = dataService.updateCar;
    } else if($scope.objectType === 'prospect') {
        // console.log('called from prospects ui');
        $scope.objectType = 'prospect';
        $scope.objects = getProspects;
        $scope.update = dataService.updateProspect;
    } else if($scope.objectType === 'asset') {
        $scope.objectType = 'asset';
        $scope.objects = getAssets;
        $scope.update = dataService.updateDriver;
    } else {
        throw Error("Undefined object type");
    }

    ctrl.deleteExpressionsUsingField = function (object) {
        var deferred = $q.defer();
        // console.log(object);
        _.each(object.data, function(data, field, list) {
            // console.log(data);
            // console.log(field);
            // console.log(list);
            if(data.type === 'function') {
                _.each(data.expressionItems, function(item) {
                    if(item.value === $scope.thing.fieldName) {
                        console.log(item.value + " is used in " + field + ". deleting " + field + " from" + $scope.objectType + " " + object.id);
                        delete object.data[field];
                    }
                });
            } else if(data.type === 'inequality') {
                _.each(data.leftExpressionItems, function(item) {
                    if(item.value === $scope.thing.fieldName) {
                        console.log(item.value + " is used in " + field + ". deleting " + field + " from" + $scope.objectType + " " + object.id);
                        delete object.data[field];
                    }
                });

                _.each(data.rightExpressionItems, function(item) {
                    if(item.value === $scope.thing.fieldName) {
                        console.log(item.value + " is used in " + field + ". deleting " + field + " from" + $scope.objectType + " " + object.id);
                        delete object.data[field];
                    }
                });
            }
        });

        deferred.resolve(object);
        deferred.reject(new Error("Error deleting functions and inequalities using " + $scope.thing.fieldName));
        return deferred.promise;
    };

    $scope.submit = function () {  
        // assumes car, driver, etc. have the same schema structure
        if($scope.confirmation.value === 'DELETE') {
            if($scope.objects !== undefined && $scope.objects !== null) {
                switch($scope.thing.type) {
                    case 'field': 
                        $scope.objects.forEach(function(obj) {
                            objectHelpers.removeFieldFromExpressions(obj, $scope.thing.fieldName).then(function(objWithRemovedField) {
                                objectHelpers.updateDisplayExpressions(objWithRemovedField).then(function(objToUpdate) {
                                    delete obj.data[$scope.thing.fieldName];
                                    // console.log(objToUpdate);
                                    $scope.update(objToUpdate);
                                    // TODO: What to do with logs containing this field?
                                    // TODO: Wht happens to fields used in expressions? -> delete them too
                                });
                            });
                        });
                        break;
                    case 'log':
                        $scope.objects.forEach(function(obj) {
                            obj.logs.forEach(function(log) {
                                if(log.weekOf === $scope.value) {
                                    obj.logs.splice(obj.logs.indexOf(log), 1);
                                    $scope.update(obj);
                                }
                            });
                        });
                        break;
                    default:
                        console.error('Invalid delete');
                }
            }
        }

        $scope.ok();
    };

    $scope.ok = function() {
        $state.forceReload();
        $modalInstance.close();
    };

    $scope.close = function () {
        $state.forceReload();
        $modalInstance.dismiss('cancel');
    };
  });
