(function() {
  'use strict';

  angular.module('clientApp')
    .controller('DeleteObjModalCtrl', ['id', 'dataService', '$uibModalInstance', '$state',
      function (id, dataService, $uibModalInstance, $state) {

      var ctrl = this;
      ctrl.input = null;
      ctrl.objectType = null;
      ctrl.postDeleteState = null;
      ctrl.delete = null;

      // determine the state or ui calling this modal
      if(_.includes($state.current.name, 'driver')) {
          // console.log('called from driver ui');
          ctrl.objectType = 'driver';
          ctrl.delete = dataService.deleteDriver;
          ctrl.postDeleteState = 'dashboard.drivers';
      } else if(_.includes($state.current.name, 'car')) {
          // console.log('called from car ui');
          ctrl.objectType = 'car';
          ctrl.postDeleteState = 'dashboard.cars';
          ctrl.delete = dataService.deleteCar;
      } else if(_.includes($state.current.name, 'prospect')) {
          // console.log('called from prospect ui');
          ctrl.objectType = 'prospect';
          ctrl.delete = dataService.deleteProspect;
          ctrl.postDeleteState = 'dashboard.prospects';
      } else {
          // console.log($state)
          console.log('delete field modal called from invalid state', $state.current);
      }

      ctrl.submit = function() {
          if(ctrl.input === 'DELETE') {
              if((typeof id !== 'undefined') && (id !== null) && (typeof ctrl.objectType === 'string')) {
                  ctrl.delete(id).then(function() {
                        ctrl.ok();
                  });
              }
          }
      };

      ctrl.ok = function() {
          $state.go(ctrl.postDeleteState);
          $uibModalInstance.close({
              type: ctrl.objectType,
              id: id
          });
      };

      ctrl.close = function () {
          $uibModalInstance.dismiss('cancel');
      };
    }]);
})();
