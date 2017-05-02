(function() {
  'use strict';

  angular.module('clientApp')
    .controller('AddFieldModalInstanceCtrl', ['$q', '$scope', '$state', '$uibModalInstance', 'getObjects', 'dataService', 'objectHelpers', '_', 'objectType', 'assetType',
    function($q, $scope, $state, $uibModalInstance, getObjects, dataService, objectHelpers, _, objectType, assetType) {

      var isValid = objectHelpers.isValid;

      var ctrl = this;
      ctrl.update = null;
      ctrl.fields = [];
      ctrl.objects = getObjects;
      ctrl.objectType = objectType;
      ctrl.assetType = assetType;

      $scope.dataTypes = [
        'Text',
        'Number',
        'Monetary',
        'Boolean'
      ];
      $scope.field = {
        name: null,
        dataType: null,
      };

      $scope.invalidFieldType = function() {
         return $scope.field.dataType === null || typeof $scope.field.dataType === 'undefined';
      };

      if(objectType === 'car') {

        ctrl.update = dataService.updateCar;

      } else if(objectType === 'driver') {

        ctrl.update = dataService.updateDriver;

      } else if(objectType === 'prospect') {

        ctrl.update = dataService.updateProspect;

      } else if(objectType === 'asset') {

        ctrl.update = dataService.updateAsset;

        ctrl.objects = _.filter(ctrl.objects, function(asset) {
          return asset.assetType === ctrl.assetType;
        });
      } else {
        $state.go('dashboard.cars');
      }

      /**
       *  General post-processing regardless of object
       */
      if(ctrl.objects.length > 0) {
        ctrl.fields = Object.keys(ctrl.objects[0].data);
      }

      $scope.fieldNameAlreadyExists = function () {
        return _.includes(ctrl.fields, $scope.field.name);
      };

      ctrl.createNewFieldData = function(field) {
        return {
          value: null,
          log: false,
          dataType: field.dataType,
        };
      };

      ctrl.appendNewFieldToObject = function(fieldName, fieldData, object) {
        object.data[fieldName] = fieldData;
        return object;
      };

      $scope.submit = function() {
        var updates = [];
        var fieldData = ctrl.createNewFieldData($scope.field);

        if(ctrl.objects.length > 0) {
          _.each(ctrl.objects, function(object) {
            var objectToUpdate = ctrl.appendNewFieldToObject($scope.field.name, fieldData, object);
            updates.push(ctrl.update(objectToUpdate));
          });
        }

        $q.all(updates).then(function() {
            $state.forceReload();
            $scope.ok(fieldData, $scope.field.name);
            $scope.ok();
        });
      };

      $scope.reset = function () {
        $scope.form.$setPristine();
        $scope.form.$setUntouched();
        $state.forceReload();
      };

      $scope.ok = function(newFieldObject, newFieldName) {
        $uibModalInstance.close({
          name: newFieldName,
          data: newFieldObject,
        });
      };

      $scope.close = function () {
          $state.forceReload();
          $uibModalInstance.dismiss('cancel');
      };
    }]);
})();
