'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AssignCarModalCtrl
 * @description
 * # AssignCarModalCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AssignmentModalCtrl', function ($window, datepicker, objectHelpers, objectType, subjectType, $q, $scope, getAssetTypes, getAssets, getCars, getDrivers, asset, car, driver, dataService, $modalInstance, $state) {
    
    var _ = $window._;
    var ctrl = this;
    ctrl.fullObjects = [];
    ctrl.simpleObjects = [];
    ctrl.subject = {};
    ctrl.subjectType = subjectType;
    ctrl.updateObj = null;
    ctrl.updateSubj = null;
    
    $scope.datepicker = datepicker;
    $scope.objIdentifier = null;   // get this from settings
    $scope.formData = {};
    $scope.objectType = objectType;
    $scope.assetTypes = getAssetTypes.data;
    
    // helpers
    var simplify = objectHelpers.simplify;

    $scope.getAssetTypeIdentifier = function() {
        if(($scope.formData.assetType !== null) && (typeof $scope.formData.assetType !== "undefined")) {
            // return 
        }
    };

    if(ctrl.subjectType === 'driver') {
        console.log("assignment modal called from driverProfile");
        ctrl.subject = driver;
        ctrl.updateSubj = dataService.updateDriver;
        ctrl.subjIdentifier = "Name" || null;

        if($scope.objectType === 'car') {
            ctrl.updateObj = dataService.updateCar;
            
            getCars().then(function(result) {
                ctrl.fullObjects = result.data;
                $scope.objIdentifier = ctrl.fullObjects[0].identifier;
                ctrl.simpleObjects = simplify(ctrl.fullObjects);
            });
        } else if($scope.objectType === 'asset') {
            ctrl.updateObj = dataService.updateAsset;

            getAssets().then(function(result) {
                ctrl.fullObjects = result.data;
                ctrl.simpleObjects = simplify(ctrl.fullObjects);
                $scope.objIdentifiers = _.uniq(_.map(ctrl.fullObjects, function(asset) {
                    return asset.assetType;
                }));
            });
        }
    } else if(ctrl.subjectType === 'car') {
        console.log("assignment modal called from carProfile");
        ctrl.subject = car;
        ctrl.updateSubj = dataService.updateCar;
        ctrl.updateObj = dataService.updateDriver;
        ctrl.subjIdentifier = ctrl.subject.identifier;  
        ctrl.fullObjects = getDrivers.data;
        $scope.objIdentifier = "Name" || null;
        ctrl.simpleObjects = simplify(ctrl.fullObjects);
    } else if(ctrl.subjectType === 'asset') {
        console.log("assignment modal called from assetProfile");
        ctrl.subject = asset;
        ctrl.updateSubj = dataService.updateAsset;
        ctrl.updateObj = dataService.updateDriver;
        ctrl.subjIdentifier = ctrl.subject.identifier;
        ctrl.fullObjects = getDrivers.data;
        $scope.objIdentifier = "Name" || null;
        ctrl.simpleObjects = simplify(ctrl.fullObjects);
    } else {
        console.log('assignment modal called from invalid state', $state.current);
    }

    $scope.validForm = function() {
        return (($scope.formData.objId === null) || (typeof $scope.formData.objId === "undefined"));
    };

    $scope.reset = function () {
      $scope.formData = {};
      $scope.form.$setPristine();
      $scope.form.$setUntouched();
      $state.forceReload();
    };

    $scope.close = function () {
        $state.forceReload();
        $modalInstance.close('ok');
    };

    ctrl.getObjectIdentifierValue = function(id) {
        var deferred = $q.defer();
        var obj = _.find(ctrl.simpleObjects, function(obj) {
            return obj.id === id;
        });

        deferred.resolve(obj.identifierValue);
        deferred.reject('Failed to get identifier value');
        return deferred.promise;
    };

    ctrl.assignSubjectToObject = function() {
        console.log(ctrl.subjIdentifier);
        console.log(ctrl.subject);
        var subject = {
            id: ctrl.subject.id,
            identifier: {
                name: ctrl.subjIdentifier,
                value: ctrl.subject.data[ctrl.subjIdentifier].value,
            },
            assetType: (ctrl.subjectType === 'asset') ? ctrl.subject.assetType : null,
            dateAssigned: $scope.datepicker.dt.getTime(),
            dateUnassigned: null
        };

        var obj = _.find(ctrl.fullObjects, function(object) {
            return object.id === $scope.formData.objId;
        });

        // setting the correct reciprocal update call
        if($scope.objectType === 'driver') {
            if(ctrl.subjectType === 'car') {
                obj.carsAssigned.push(subject);
            } else if(ctrl.subjectType === 'asset') {
                obj.assetsAssigned.push(subject);
            }
        } else if($scope.objectType === 'car') {
            obj.driversAssigned.push(subject);
        } else if($scope.objectType === 'asset') {
            obj.driversAssigned.push(subject);
        } else {
            console.log('Invalid assignment operation', {
                subject: ctrl.subjectType,
                objects: $scope.objectType
            });
        }

        ctrl.updateObj(obj);
    };

    // Assign object to subject
    $scope.submit = function() {

        ctrl.getObjectIdentifierValue($scope.formData.objId).then(function(identifierValue) {
            var object = {
                id: parseInt($scope.formData.objId),
                identifier: {
                    name: $scope.objIdentifier,
                    value: identifierValue
                },
                assetType: ($scope.objectType === 'asset') ? $scope.assetType : null,
                dateAssigned: $scope.datepicker.dt.getTime(),
                dateUnassigned: null
            };
            
            if(ctrl.subjectType === 'driver') {
                if($scope.objectType === 'car') {
                    ctrl.subject.carsAssigned.push(object);
                } else if($scope.objectType === 'asset') {
                    ctrl.subject.assetsAssigned.push(object);
                }

                ctrl.updateSubj(ctrl.subject);
            } else if(ctrl.subjectType === 'car') {
                ctrl.subject.driversAssigned.push(object);
                ctrl.updateSubj(ctrl.subject);
            } else if(ctrl.subjectType === 'asset') {
                ctrl.subject.driversAssigned.push(object);
                ctrl.updateSubj(ctrl.subject);
            } else {
                console.log('Invalid assignment operation', {
                    subject: ctrl.subjectType,
                    objects: $scope.objectType
                });
            }

            ctrl.assignSubjectToObject();
            $scope.close();
        });
    };
  });
