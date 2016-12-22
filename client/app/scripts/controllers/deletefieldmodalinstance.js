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
    .controller('DeleteFieldModalInstanceCtrl', ['_', 'objectHelpers', '$q', 'getAssets', 'getProspects', 'getDrivers', 'getCars', 'objectType', 'thing', 'dataService', '$scope', '$uibModalInstance', '$state',
      function(_, objectHelpers, $q, getAssets, getProspects, getDrivers, getCars, objectType, thing, dataService, $scope, $uibModalInstance, $state) {

      // not used by view
      var ctrl = this;
      ctrl.objects = [];
      ctrl.update = null;

      // used by view
      $scope.confirmation = { value: "" };
      $scope.objectType = objectType;
      $scope.thing = thing;

      // determine the state or ui calling this modal
      if($scope.objectType === 'driver') {
          // console.log('called from drivers uaq
          ctrl.objects = getDrivers;
          ctrl.update = dataService.updateDriver;
      } else if($scope.objectType === 'car') {
          // console.log('called from cars ui');
          ctrl.objects = getCars;
          ctrl.update = dataService.updateCar;
      } else if($scope.objectType === 'prospect') {
          // console.log('called from prospects ui');
          ctrl.objects = getProspects;
          ctrl.update = dataService.updateProspect;
      } else if($scope.objectType === 'asset') {
          ctrl.objects = getAssets;
          console.log(getAssets);
          ctrl.update = dataService.updateAsset;
      } else {
          throw Error("Undefined object type");
      }

      ctrl.deleteExpressionsUsingField = function (object) {
          var deferred = $q.defer();
          // console.log(object);
          _.each(object.data, function(data, field, list) {
              if(data.type === 'function') {
                  _.each(data.expressionItems, function(item) {
                      if(item.value === $scope.thing.fieldName) {
                          console.log(item.value + " is used in " + field + ". deleting " + field + " from" + $scope.objectType + " " + object.id);
                          delete object.data[field];
                      }
                  });
              } else if(data.type === 'inequality') {
                  _.each(data.leftExpressionItems, function(item) {
                      if(item.value === $scope.thing.fieldName) {
                          console.log(item.value + " is used in " + field + ". deleting " + field + " from" + $scope.objectType + " " + object.id);
                          delete object.data[field];
                      }
                  });

                  _.each(data.rightExpressionItems, function(item) {
                      if(item.value === $scope.thing.fieldName) {
                          console.log(item.value + " is used in " + field + ". deleting " + field + " from" + $scope.objectType + " " + object.id);
                          delete object.data[field];
                      }
                  });
              }
          });

          deferred.resolve(object);
          deferred.reject(new Error("Error deleting functions and inequalities using " + $scope.thing.fieldName));
          return deferred.promise;
      };

      $scope.submit = function () {
          // console.log($scope.thing);
          // assumes car, driver, etc. have the same schema structure
          if($scope.confirmation.value === 'DELETE') {
              if(ctrl.objects !== undefined && ctrl.objects !== null) {
                  switch($scope.thing.type) {
                      case 'field':
                          ctrl.objects.forEach(function(obj) {
                              objectHelpers.removeFieldFromExpressions(obj, $scope.thing.fieldName).then(function(objWithRemovedField) {
                                  objectHelpers.updateDisplayExpressions(objWithRemovedField).then(function(objToUpdate) {
                                      delete obj.data[$scope.thing.fieldName];
                                      // console.log(objToUpdate);
                                      ctrl.update(objToUpdate);
                                      // TODO: What to do with logs containing this field?
                                      // TODO: Wht happens to fields used in expressions? -> delete them too
                                  });
                              });
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
