'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AssetlistCtrl
 * @description
 * # AssetlistCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AssetListCtrl', function (assetHelpers, dataService, getAssets, getAssetTypes, $scope, $modal, $state) {
    $scope.assetTypes = getAssetTypes.data;
    $scope.types = $scope.assetTypes.types;
    $scope.order = [];
    $scope.newIndex = { val: null };    // stores index changes
    for(var i = 0; i < $scope.types.length; i++) $scope.order[i] = i;    // populate order select
    $scope.assets = assetHelpers.mapObject(getAssets.data);

    $scope.thereAreAssetsOfType = function(type) {
        var assets = _.filter($scope.assets, function(asset) {
            return asset.assetTtype === type;
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

    $scope.updateOrder = function(oldIndex, newIndex) {
        $scope.types.move(oldIndex, newIndex);
        $scope.assetTypes.types = $scope.types;
    };

    // when type name changes
    $scope.updateTypeInAssets = function(oldName, newName) {
        _.each($scope.assets, function(asset) {
            if(asset.status.value === oldName) {
                asset.status.value = newName;
                asset.data.status.value = newName;
                dataService.updateAsset(asset);
            }
        });
    };

    $scope.saveType = function(data, oldIndex, oldName) {
        if(oldIndex != $scope.newIndex.val) $scope.updateOrder(oldIndex, $scope.newIndex.val)
        dataService.updateAssetTypes($scope.assetTypes);
        $scope.updateTypeInAssets(oldName, data.name);
        $state.forceReload();
    };

    $scope.addType = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/assetTypeModal.html',
            controller: 'AssetTypeModalCtrl',
            size: 'md',
            resolve: {
                getAssetTypes: function(dataService) {
                    return dataService.getAssetTypes();
                }
            }
        });

        modalInstance.result.then(function () {
            console.log('AssetTypeModal dismissed at: ' + new Date());
        });
    };
  });
