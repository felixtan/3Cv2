(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name clientApp.controller:DeletefieldmodalinstanceCtrl
   * @description
   * # DeletefieldmodalinstanceCtrl
   * Controller of the clientApp
   */
  angular.module('clientApp')
    .controller('DeleteFieldModalCtrl', ['_', 'objectHelpers', 'getObjects', 'objectType', 'thing', 'dataService', '$scope', '$uibModalInstance', '$state',
      function(_, objectHelpers, getObjects, objectType, thing, dataService, $scope, $uibModalInstance, $state) {

      // not used by view
      var ctrl = this;
      ctrl.objects = getObjects;
      ctrl.update = null;
      
      // used by view
      $scope.confirmation = { value: "" };
      $scope.objectType = objectType;
      $scope.thing = thing;

      // determine the state or ui calling this modal
      if($scope.objectType === 'driver') {
          ctrl.update = dataService.updateDriver;
      } else if($scope.objectType === 'car') {
          ctrl.update = dataService.updateCar;
      } else if($scope.objectType === 'prospect') {
          ctrl.update = dataService.updateProspect;
      } else if($scope.objectType === 'asset') {
          ctrl.update = dataService.updateAsset;
      } else {
          throw Error("Undefined object type");
      }

      $scope.submit = function () {
          // assumes car, driver, etc. have the same schema structure
          if($scope.confirmation.value === 'DELETE') {
              if(ctrl.objects !== undefined && ctrl.objects !== null) {
                  switch($scope.thing.type) {
                      case 'field':
                          ctrl.objects.forEach(function(obj) {
                              delete obj.data[$scope.thing.fieldName];
                              ctrl.update(obj);
                              // TODO: What to do with logs containing this field?
                          });
                          break;
                      case 'log':
                          ctrl.objects.forEach(function(obj) {
                              obj.logs.forEach(function(log) {
                                  if(log.weekOf === $scope.thing.logDate) {
                                      obj.logs.splice(obj.logs.indexOf(log), 1);
                                      ctrl.update(obj);
                                  }
                              });
                          });
                          break;
                      default:
                          console.error('Invalid delete');
                  }
              }
          }

          $scope.ok();
      };

      $scope.ok = function() {
          $state.forceReload();
          $uibModalInstance.close();
      };

      $scope.close = function () {
          $state.forceReload();
          $uibModalInstance.dismiss('cancel');
      };
    }]);
})();
