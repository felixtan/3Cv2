(function() {
  'use strict';

  /**
   * @ngdoc function
   * @value clientApp.controller:ProspectStatusModalCtrl
   * @description
   * # ProspectStatusModalCtrl
   * Controller of the clientApp
   */
  angular.module('clientApp')
    .controller('ProspectStatusModalCtrl', ['prospectHelpers', '$scope', 'prospectStatuses', '$state', '$uibModalInstance',
      function(prospectHelpers, $scope, prospectStatuses, $state, $uibModalInstance) {

      $scope.newStatus = { value: null };

      $scope.validForm = function() {
          return (($scope.newStatus.value !== null) && (typeof $scope.newStatus.value !== "undefined"));
      };

      $scope.submit = function() {
          prospectStatuses.statuses[prospectStatuses.statuses.length++] = $scope.newStatus;
          prospectHelpers.updateStatuses(prospectStatuses).then(function() {
              $state.forceReload();
              $scope.close();
          });
      };

      $scope.reset = function () {
        $scope.newStatus = { value: null };
      };

      $scope.close = function () {
          $uibModalInstance.dismiss('cancel');
      };
    }]);
})();
