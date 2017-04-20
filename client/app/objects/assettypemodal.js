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
    .controller('AssetTypeModalCtrl', ['assetHelpers', '$scope', 'assetTypes', '$state', '$uibModalInstance',
    function (assetHelpers, $scope, assetTypes, $state, $uibModalInstance) {

      $scope.newType = { value: null };

      $scope.validForm = function() {
          return (($scope.newType.value !== null) && (typeof $scope.newType.value !== "undefined"));
      };

      $scope.submit = function() {
          assetTypes.types[assetTypes.types.length++] = $scope.newType;
          assetHelpers.updateTypes(assetTypes).then(function() {
              $state.forceReload();
              $scope.close();
          });
      };

      $scope.reset = function () {
        $scope.newType = { value: null };
      };

      $scope.close = function () {
          $uibModalInstance.dismiss('cancel');
      };
    }]);
})();
