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
    .controller('DeleteModalCtrl', ['_', 'objectHelpers', 'getObjects', 'objectType', 'thing', 'dataService', '$uibModalInstance', '$state',
      function(_, objectHelpers, getObjects, objectType, thing, dataService, $uibModalInstance, $state) {

      // not used by view
      var ctrl = this;
      ctrl.objects = getObjects;
      ctrl.update = null;

      // used by view
      ctrl.confirmation = { value: "" };
      ctrl.objectType = objectType;
      ctrl.thing = thing;

      // determine the state or ui calling this modal
      if(ctrl.objectType === 'driver') {
          ctrl.update = dataService.updateDriver;
      } else if(ctrl.objectType === 'car') {
          ctrl.update = dataService.updateCar;
      } else if(ctrl.objectType === 'prospect') {
          ctrl.update = dataService.updateProspect;
      } else if(ctrl.objectType === 'asset') {
          ctrl.update = dataService.updateAsset;
      } else {
          throw Error("Undefined object type");
      }

      ctrl.submit = function () {
          // assumes car, driver, etc. have the same schema structure
          if(ctrl.confirmation.value === 'DELETE') {
              if(ctrl.objects !== undefined && ctrl.objects !== null) {
                  switch(ctrl.thing.type) {
                      case 'field':
                          ctrl.objects.forEach(function(obj) {
                              delete obj.data[ctrl.thing.fieldName];
                              ctrl.update(obj);
                              // TODO: What to do with logs containing this field?
                          });
                          break;
                      case 'log':
                          ctrl.objects.forEach(function(obj) {
                              obj.logs.forEach(function(log) {
                                  if(log.weekOf === ctrl.thing.logDate) {
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

          ctrl.ok();
      };

      ctrl.ok = function() {
          $state.forceReload();
          $uibModalInstance.close();
      };

      ctrl.close = function () {
          $state.forceReload();
          $uibModalInstance.dismiss('cancel');
      };
    }]);
})();
