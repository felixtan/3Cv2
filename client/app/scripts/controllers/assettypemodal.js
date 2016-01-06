'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AssettypemodalCtrl
 * @description
 * # AssettypemodalCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AssetTypeModalCtrl', function (dataService, $scope, getAssetTypes, $state, $modalInstance) {
    $scope.assetTypes = getAssetTypes.data;
    $scope.newType = { value: null };

    $scope.validForm = function() {
        return (($scope.newType.value !== null) && (typeof $scope.newType.value !== "undefined"));
    };

    $scope.submit = function() {
        $scope.assetTypes.types.push($scope.newType);
        dataService.updateAssetTypes($scope.assetTypes);
        $scope.close();
    };

    $scope.reset = function () {
      $scope.newType = { value: null };
    };

    $scope.close = function () {
        $state.forceReload();
        $modalInstance.dismiss('cancel');
    };
  });
