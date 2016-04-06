'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CardataCtrl
 * @description
 * # CardataCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ObjectDataCtrl', function (objectType, objectId, assetHelpers, prospectHelpers, driverHelpers, carHelpers, $q, $state, $scope, $modal) {   
    
    var ctrl = this;        // for testing;
    $scope.objectType = objectType;
    $scope.assetType = { value: null };

    ctrl.getObject = function () {
        if($scope.objectType === 'car') {
            $scope.state = {
                data: 'carData({ id: object.id })',
                logs: 'carLogs({ id: object.id })',
            };
            return carHelpers.getById;
        } else if($scope.objectType === 'driver') {
            $scope.state = {
                data: 'driverData({ id: object.id })',
                logs: 'driverLogs({ id: object.id })',
            };
            return driverHelpers.getById;
        } else if($scope.objectType === 'prospect') {
            $scope.state = {
                data: 'prospectData({ id: object.id })',
                logs: null,
            };
            return prospectHelpers.getById;
        } else if($scope.objectType === 'asset') {
            $scope.state = {
                data: 'assetData({ id: object.id })',
                logs: 'assetLogs({ id: object.id })',
            };
            return assetHelpers.getById;
        }
    };

    ctrl.getObjects = function () {
        if($scope.objectType === 'car') {
            return carHelpers.get;
        } else if($scope.objectType === 'driver') {
            return driverHelpers.get;
        } else if($scope.objectType === 'prospect') {
            return prospectHelpers.get;
        } else if($scope.objectType === 'asset') {
            return assetHelpers.get;
        }
    };

    ctrl.getObject()(objectId).then(function(result1) {
        $scope.object = result1.data;
        
        // TODO: see instead of having two variables, can use one and ng-change
        $scope.currentIdentifier = { name: $scope.object.identifier || null };
        $scope.newIdentifier = { name: $scope.object.identifier || null };

        $scope.identifierValue = $scope.object.data[$scope.object.identifier].value;

        $scope.tabs = [
            { title: 'Data', active: true, state: $scope.state.data },
            { title: 'Logs', active: false, state: $scope.state.logs }
        ];

        ctrl.getObjects()().then(function(result2) {
            $scope.objects = result2.data;
        });
    });

    // Add field
    $scope.addField = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/addfieldmodal.html',
            controller: 'AddFieldModalInstanceCtrl',
            size: 'md',
            resolve: {
                getCars: function() {
                    return ($scope.objectType === 'car') ? $scope.objects : {};
                },
                getDrivers: function() {
                    return ($scope.objectType === 'driver') ? $scope.objects : {};
                },
                getProspects: function() {
                    return ($scope.objectType === 'prospect') ? $scope.objects : {};  
                },
                getAssets: function() {
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

        modalInstance.result.then(function () {
            $state.forceReload();
        }, function() {
            $state.forceReload();
            console.log('Modal dismissed at: ' + new Date());
        });
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
                getDrivers: function() {
                    return driverHelpers.get;
                },
                getCars: function() {
                    return [];
                },
                driver: function() {
                    return {};
                },
                car: function() {
                    return $scope.object;
                },
                subjectType: function() {
                    return "car";
                },
                objectType: function() {
                    return 'driver';
                },
                getAssetTypes: function() {
                    return [];
                },
                getAssets: function() {
                    return [];
                },
                asset: function() {
                    return {};
                },
            }
        });

        modalInstance.result.then(function (input) {
            console.log('passed back from AssignmentModalCtrl:', input);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
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
                    return $scope.objectType === 'car' ? $scope.objects : [];
                },
                getProspects: function() {
                    return $scope.objectType === 'prospect' ? $scope.objects : [];
                },
                getDrivers: function() {
                    return $scope.objectType === 'driver' ? $scope.objects : [];
                },
                getAssets: function() {
                    return $scope.objectType === 'asset' ? $scope.objects : [];
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