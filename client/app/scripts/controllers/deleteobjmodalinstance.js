(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name clientApp.controller:DeleteobjmodalinstanceCtrl
   * @description
   * # DeleteobjmodalinstanceCtrl
   * Controller of the clientApp
   */
  angular.module('clientApp')
    .controller('DeleteObjModalInstanceCtrl', ['id', 'dataService', '$scope', '$modalInstance', '$state',
      function (id, dataService, $scope, $modalInstance, $state) {
      $scope.input = null;
      $scope.objectType = null;
      $scope.delete = function(id) { return; };
      $scope.postDeleteState = null;

      // determine the state or ui calling this modal
      if($state.includes('driverProfile')) {
          console.log('called from driver ui');
          $scope.objectType = 'driver';
          $scope.delete = dataService.deleteDriver;
          $scope.postDeleteState = 'dashboard.drivers';
      } else if($state.includes('carProfile')) {
          console.log('called from car ui');
          $scope.objectType = 'car';
          $scope.postDeleteState = 'dashboard.cars';
          $scope.delete = dataService.deleteCar;
      } else if($state.includes('prospectProfile')) {
          console.log('called from prospect ui');
          $scope.objectType = 'prospect';
          $scope.delete = dataService.deleteProspect;
          $scope.postDeleteState = 'dashboard.prospects';
      } else {
          console.log('delete field modal called from invalid state', $state.current);
      }

      $scope.submit = function() {
          if($scope.input === 'DELETE') {
              if((typeof id !== 'undefined') && (id !== null) && (typeof $scope.objectType === 'string')) {
                  $scope.delete(id);
              }

              $scope.ok();
          }
      };

      $scope.ok = function() {
          $state.go($scope.postDeleteState);
          $modalInstance.close({
              type: $scope.objectType,
              id: id
          });
      };

      $scope.close = function () {
          $state.forceReload();
          $modalInstance.dismiss('cancel');
      };
    }]);
})();
