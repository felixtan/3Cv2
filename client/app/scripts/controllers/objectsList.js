'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ObjectListCtrl', function ($window, objectType, objectHelpers, carHelpers, driverHelpers, prospectHelpers, assetHelpers, $state, $modal, $q, $scope) {
    // console.log($scope.user);

    var ctrl = this,
        _ = $window._;
    $scope.objectType = objectType;
    $scope.order = [];

    ctrl.getObjects = function () {
        switch($scope.objectType) {
            case "car":
                $scope.title = { value: "Car" };
                $scope.profile = { state: 'carData({ id: object.id })' };
                return carHelpers.get;
            case "driver":
                $scope.title = { value: "Driver" };
                $scope.profile = { state: 'driverData({ id: object.id })' };
                return driverHelpers.get;
            case "prospect":
                $scope.title = { value: "Prospect" };
                $scope.profile = { state: 'prospectData({ id: object.id })' };

                prospectHelpers.getStatuses().then(function(result) {
                    ctrl.prospectStatuses = result.data; 
                    $scope.statuses = ctrl.prospectStatuses.statuses;
                    $scope.newIndex = { val: null };    // stores index changes
                    for(var i = 0; i < $scope.statuses.length; i++) {
                        $scope.order[i] = i;
                    }
                });
                 
                return prospectHelpers.get;
            case "asset":
                $scope.title = { value: "Asset" };
                $scope.profile = { state: 'assetData({ id: object.id })' };
                
                assetHelpers.getAssetTypes().then(function(result) {
                    // console.log(result);
                    if(objectHelpers.isValid(result.data)) {
                        $scope.assetTypes = result.data;
                        $scope.types = $scope.assetTypes.types;

                        for(var i = 0; i < $scope.types.length; i++) {
                            $scope.order[i] = i;    // populate order select
                        }
                    }
                });
                
                // $scope.order = [];
                // $scope.newIndex = { val: null };    // stores index changes
                
                return assetHelpers.get;
            default:
                $scope.title = { value: "Car" };
                $scope.profile = { state: 'carData({ id: object.id })' };
                return carHelpers.get;
        }
    };

    ctrl.getObjects()().then(function(result) {
        $scope.objects = result.data;
        $scope.simpleObjects = objectHelpers.simplify($scope.objects);
        // console.log($scope.simpleObjects);
    });

    // submit xeditable row form by pressing enter
    // will then call updateDriver
    // to use this add following attribute to button element
    // e-ng-keypress="keypress($event, driverRowForm)"

    // This actually works
    // $scope.keypress = function(e, form) {
    //     if (e.which === 13) {
    //         form.$submit();
    //     }
    // };

    $scope.thereAreObjects = function() { 
        // console.log($scope.objects);
        return (typeof $scope.objects !== 'undefined' && $scope.objects.length > 0); 
    };

    $scope.addObject = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/addobjectmodal.html',
            controller: 'AddObjectModalInstanceCtrl',
            size: 'md',
            resolve: {
                objectType: function() {
                    return $scope.objectType;
                },
                getCars: function() {
                    return ($scope.objectType === 'car') ? carHelpers.get() : [];
                },
                getDrivers: function() {
                    return ($scope.objectType === 'driver') ? driverHelpers.get() : [];
                },
                getProspects: function() {
                    return ($scope.objectType === 'prospect') ? prospectHelpers.get() : [];  
                },
                getAssets: function() {
                    return ($scope.objectType === 'asset') ? assetHelpers.get() : [];
                },
                assetType: function() {
                    return null;
                }
            }
        });

        modalInstance.result.then(function () {
            // $state.forceReload();
        }, function() {
            // $state.forceReload();
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    //
    // Asset list stuff
    /////////////////////////////////////////////////////////////////////
    $scope.addType = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/assetTypeModal.html',
            controller: 'AssetTypeModalCtrl',
            size: 'md',
            resolve: {
                getAssetTypes: function() {
                    return assetHelpers.getAssetTypes();
                }
            }
        });

        modalInstance.result.then(function () {
            console.log('AssetTypeModal dismissed at: ' + new Date());
        });
    };

    /*
        accepts:
            1. asset object
            2. type object
    */
    $scope.belongsToType = assetHelpers.belongsToType;

    // http://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
    Array.prototype.move = function (old_index, new_index) {
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    };

    ctrl.updateOrder = function(oldIndex, newIndex) {
        $scope.types.move(oldIndex, newIndex);
        $scope.assetTypes.types = $scope.types;
    };

    // when type name changes
    $scope.updateTypeInAssets = function(oldName, newName) {
        _.each($scope.assets, function(asset) {
            if(asset.status.value === oldName) {
                asset.status.value = newName;
                asset.data.status.value = newName;
                assetHelpers.update(asset);
            }
        });
    };

    $scope.saveType = function(data, oldIndex, oldName) {
        if(parseInt(oldIndex) !== parseInt($scope.newIndex.val)) {
            ctrl.updateOrder(oldIndex, $scope.newIndex.val);
        }
        assetHelpers.updateTypes($scope.assetTypes);
        $scope.updateTypeInAssets(oldName, data.name);
        $state.forceReload();
    };

    //
    // Prospect list stuff
    /////////////////////////////////////////////////////////////////////
    $scope.belongsToStatus = prospectHelpers.belongsToStatus;

    ctrl.updateOrder = function(oldIndex, newIndex) {
        $scope.statuses.move(oldIndex, newIndex);
        ctrl.prospectStatuses.statuses = $scope.statuses;
    };

    // when status name changes
    ctrl.updateStatusInProspects = function(oldName, newName) {
        _.each($scope.objects, function(prospect) {
            if(prospect.status.value === oldName) {
                prospect.status.value = newName;
                prospect.data.status.value = newName;
                prospectHelpers.update(prospect);
            }
        });
    };

    $scope.saveStatus = function(data, oldIndex, oldName) {
        if(parseInt(oldIndex) !== parseInt($scope.newIndex.val)) {
            ctrl.updateOrder(oldIndex, $scope.newIndex.val);
        }
        prospectHelpers.updateStatuses(ctrl.prospectStatuses);
        ctrl.updateStatusInProspects(oldName, data.name);
        $state.forceReload();
    };

    ctrl.getDefaultStatus = function() {
        return _.findWhere($scope.statuses, { special: true });
    };

    // when a status is deleted
    ctrl.unassignProspects = function(statusName) {
        var defaultStatus = ctrl.getDefaultStatus();
        _.each($scope.objects, function(prospect) {
            if(prospect.status.value === statusName) {
                prospect.status = defaultStatus;
                prospect.data.status = defaultStatus;
                prospectHelpers.update(prospect);
            }
        });
    };

    // TODO add warning for user
    // Prospects with the deleted status are reassigned to Unassigned
    $scope.deleteStatus = function(index, statusName) {
        $scope.statuses.splice(index, 1);
        ctrl.prospectStatuses.statuses = $scope.statuses;
        prospectHelpers.updateStatuses(ctrl.prospectStatuses);
        ctrl.unassignProspects(statusName);
        $state.forceReload();
    };

    $scope.addStatus = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/prospectstatusmodal.html',
            controller: 'ProspectStatusModalCtrl',
            size: 'md',
            resolve: {
                getProspectStatuses: function() {
                    return prospectHelpers.getStatuses();
                }
            }
        });

        modalInstance.result.then(function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
});