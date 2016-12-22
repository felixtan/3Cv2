(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name clientApp.controller:AddObjectModalCtrl
   * @description
   * # AddObjectModalCtrl
   * Controller of the clientApp
   */
  angular.module('clientApp')
    .controller('AddObjectModalCtrl', ['$scope', '$state', '$uibModal', 'dataService',
      function ($scope, $state, $uibModal, dataService) {

      $scope.open = function() {
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'views/addobjectmodal.html',
              controller: 'AddObjectModalInstanceCtrl',
              size: 'md'
          });

          modalInstance.result.then(function (formData) {
              $state.forceReload();
          }, function() {
              $state.forceReload();
              console.log('Modal dismissed at: ' + new Date());
          });
      };
    }]);
})();
