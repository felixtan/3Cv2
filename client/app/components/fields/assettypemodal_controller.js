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
    .controller('AssetTypeModalCtrl', ['assetHelpers', 'assetTypes', '$state', '$uibModalInstance',
    function (assetHelpers, assetTypes, $state, $uibModalInstance) {

      var ctrl = this;
      ctrl.assetTypes = assetTypes;
      ctrl.newType = { value: null };

      ctrl.validForm = function() {
          return ((ctrl.newType.value !== null) && (typeof ctrl.newType.value !== "undefined"));
      };

      ctrl.submit = function() {
          ctrl.assetTypes.types[ctrl.assetTypes.types.length++] = ctrl.newType;
          assetHelpers.updateTypes(ctrl.assetTypes).then(function() {
              $state.forceReload();
              ctrl.close();
          });
      };

      ctrl.reset = function () {
        ctrl.newType = { value: null };
      };

      ctrl.close = function () {
          $uibModalInstance.dismiss('cancel');
      };
    }]);
})();
