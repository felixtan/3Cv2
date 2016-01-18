'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AssetdataCtrl
 * @description
 * # AssetdataCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AssetDataCtrl', function ($q, assetHelpers, $state, dataService, $scope, getAsset, getAssets, $modal) {   
    
    $scope.asset = getAsset.data;
    $scope.assets = _.filter(getAssets.data, function(asset) { return (asset.assetType === $scope.asset.assetType); });
    $scope.currentIdentifier = { name: $scope.asset.identifier || null };
    $scope.identifier = { name: $scope.asset.identifier || null };
    $scope.tabs = [
        { title: 'Data', active: true, state: 'assetProfile.data({ type: asset.assetType, id: asset.id })' },
        { title: 'Logs', active: false, state: 'assetProfile.logs({ type: asset.assetType, id: asset.id })' }
    ];

    ///////////////////
    ///// Data UI /////
    ///////////////////

    // var getFields = function(asset) {
    //     $scope.fields = Object.keys($scope.asset.data);
    //     return $scope.fields;
    // }
    // getFields();
    $scope.fields = assetHelpers.getFields($scope.asset);

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

    $scope.updateFieldName = function(asset) {
        var deferred = $q.defer();
        asset.data[$scope.newFieldName] = asset.data[$scope.currentFieldName];
        delete asset.data[$scope.currentFieldName];
        deferred.resolve(asset);
        deferred.reject(new Error('Error updating asset field name, id: ' + asset.id));
        return deferred.promise;
    };

    $scope.updateLogVal = function(asset) {
        var deferred = $q.defer();
        asset.data[$scope.currentFieldName].log = $scope.newLogVal;
        deferred.resolve(asset);
        deferred.reject(new Error('Error updating field log value'));
        return deferred.promise;
    };

    $scope.addFieldToLogs = function(asset, field) {
        var deferred = $q.defer();
        _.each(asset.logs, function(log) {
            log.data[field] = null;    
        });
        deferred.resolve(asset);
        deferred.reject(new Error('Error adding field to all logs'));
        return deferred.promise;
    };

    $scope.save = function (data, field) {
        // console.log('data:', data);
            // data.name -> updated field name
            // data.value -> updated field value
            // data.log -> updated field log

        if($scope.fieldNameChanged() && !$scope.logValChanged()) {
            _.each($scope.assets, function(asset) {
                $scope.updateFieldName(asset).then(function(assetWithUpdatedFieldName) {
                    // console.log('saving:', assetWithUpdatedFieldName);
                    dataService.updateAsset(assetWithUpdatedFieldName);
                    if(assetWithUpdatedFieldName.id == $scope.asset.id) $state.forceReload();
                });
            });
        } else if($scope.logValChanged() && !$scope.fieldNameChanged()) {
            _.each($scope.assets, function(asset) {
                $scope.updateLogVal(asset).then(function(assetWithUpdatedLogVal) {
                    $scope.addFieldToLogs(assetWithUpdatedLogVal, data.name).then(function(assetWithUpdatedLogs) {
                        // console.log('saving:', assetWithUpdatedLogs);
                        dataService.updateAsset(assetWithUpdatedLogs);
                        if(assetWithUpdatedLogs.id == $scope.asset.id) $state.forceReload();
                    });
                });
            });
        } else if($scope.logValChanged() && $scope.fieldNameChanged()) {
            _.each($scope.assets, function(asset) {
               $scope.updateLogVal(asset).then(function(assetWithUpdatedLogVal) {
                    $scope.addFieldToLogs(assetWithUpdatedLogVal, data.name).then(function(assetWithUpdatedLogs) {
                        $scope.updateFieldName(assetWithUpdatedLogs).then(function(assetWithUpdatedFieldName) {
                            // console.log('saving:', assetWithUpdatedFieldName);
                            dataService.updateAsset(assetWithUpdatedFieldName);
                            if(assetWithUpdatedFieldName.id == $scope.asset.id) $state.forceReload();
                        });
                    });
                });
            });
        } else {
            dataService.updateAsset($scope.asset);
            $state.forceReload();
        }

        assetHelpers.updateIdentifier($scope.assets, $scope.currentIdentifier.name, $scope.identifier.name);
    };

    // Add field
    $scope.addField = function() {
        console.log($scope.asset.assetType);
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
                    return $scope.asset.assetType;
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
                getAssets: function() {
                    return {};
                },
                getAssetTypes: function() {
                    return {};
                },
                getCars: function() {
                    return {};
                },
                driver: function() {
                    return {};
                },
                car: function() {
                    return {};
                },
                asset: function() {
                    return $scope.asset;
                },
                subjectType: function() {
                    return "asset";
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
  });