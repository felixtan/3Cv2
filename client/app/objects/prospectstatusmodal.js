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
    .controller('ProspectStatusModalCtrl', ['dataService', '$scope', 'getProspectStatuses', '$state', '$uibModalInstance',
      function (dataService, $scope, getProspectStatuses, $state, $uibModalInstance) {

      $scope.statuses = getProspectStatuses.data;
      $scope.newStatus = { value: null };

      $scope.validForm = function() {
          return (($scope.newStatus.value !== null) && (typeof $scope.newStatus.value !== "undefined"));
      };
      console.log($scope.statuses)
      $scope.submit = function() {
          // $scope.statuses.statuses.push($scope.newStatus);
          // $scope.statuses.statuses[]
          dataService.updateProspectStatuses($scope.statuses);
          $scope.close();
      };

      $scope.reset = function () {
        $scope.newStatus = { value: null };
      };

      $scope.close = function () {
          $state.forceReload();
          $uibModalInstance.dismiss('cancel');
      };
    }]);
})();
