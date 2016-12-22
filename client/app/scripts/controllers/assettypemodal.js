(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name clientApp.controller:AssetTypeModalCtrl
   * @description
   * # AssetTypeModalCtrl
   * Controller of the clientApp
   */
  angular.module('clientApp')
    .controller('AssetTypeModalCtrl', ['dataService', '$scope', 'getTypes', '$state', '$uibModalInstance',
    function (dataService, $scope, getTypes, $state, $uibModalInstance) {
      $scope.assetTypes = getTypes.data;
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
          $uibModalInstance.dismiss('cancel');
      };
    }]);
})();
