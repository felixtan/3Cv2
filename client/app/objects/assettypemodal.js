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

      var ctrl = this;
      ctrl.assetTypes = assetTypes;
      $scope.newType = { value: null };

      $scope.validForm = function() {
          return (($scope.newType.value !== null) && (typeof $scope.newType.value !== "undefined"));
      };

      $scope.submit = function() {
          ctrl.assetTypes.types[ctrl.assetTypes.types.length++] = $scope.newType;
          assetHelpers.updateTypes(ctrl.assetTypes).then(function() {
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
