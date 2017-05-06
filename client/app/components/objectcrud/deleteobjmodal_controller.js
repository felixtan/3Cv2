(function() {
  'use strict';

  angular.module('clientApp')
    .controller('DeleteObjModalCtrl', ['id', 'dataService', '$scope', '$uibModalInstance', '$state',
      function (id, dataService, $scope, $uibModalInstance, $state) {

      $scope.input = null;
      $scope.objectType = null;
      $scope.postDeleteState = null;
      $scope.delete = null;

      // determine the state or ui calling this modal
      if(_.includes($state.current.name, 'driver')) {
          // console.log('called from driver ui');
          $scope.objectType = 'driver';
          $scope.delete = dataService.deleteDriver;
          $scope.postDeleteState = 'dashboard.drivers';
      } else if(_.includes($state.current.name, 'car')) {
          // console.log('called from car ui');
          $scope.objectType = 'car';
          $scope.postDeleteState = 'dashboard.cars';
          $scope.delete = dataService.deleteCar;
      } else if(_.includes($state.current.name, 'prospect')) {
          // console.log('called from prospect ui');
          $scope.objectType = 'prospect';
          $scope.delete = dataService.deleteProspect;
          $scope.postDeleteState = 'dashboard.prospects';
      } else {
          // console.log($state)
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
          $uibModalInstance.close({
              type: $scope.objectType,
              id: id
          });
      };

      $scope.close = function () {
          $state.forceReload();
          $uibModalInstance.dismiss('cancel');
      };
    }]);
})();
