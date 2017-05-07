(function() {
  'use strict';

  angular.module('clientApp')
    .controller('AddFieldModalCtrl', ['$q', '$state', '$uibModalInstance', 'getObjects', 'dataService', 'objectHelpers', '_', 'objectType', 'assetType',
    function($q, $state, $uibModalInstance, getObjects, dataService, objectHelpers, _, objectType, assetType) {

      var isValid = objectHelpers.isValid;

      var ctrl = this;
      ctrl.update = null;
      ctrl.fields = [];
      ctrl.objects = getObjects;
      ctrl.objectType = objectType;
      ctrl.assetType = assetType;

      ctrl.dataTypes = [
        'Text',
        'Number',
        'Monetary',
        'Boolean'
      ];
      ctrl.field = {
        name: null,
        dataType: null,
      };

      ctrl.invalidFieldType = function() {
         return ctrl.field.dataType === null || typeof ctrl.field.dataType === 'undefined';
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

      ctrl.fieldNameAlreadyExists = function () {
        return _.includes(ctrl.fields, ctrl.field.name);
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

      ctrl.submit = function() {
        var updates = [];
        var fieldData = ctrl.createNewFieldData(ctrl.field);

        if(ctrl.objects.length > 0) {
          _.each(ctrl.objects, function(object) {
            var objectToUpdate = ctrl.appendNewFieldToObject(ctrl.field.name, fieldData, object);
            updates.push(ctrl.update(objectToUpdate));
          });
        }

        $q.all(updates).then(function() {
            $state.forceReload();
            ctrl.ok(fieldData, ctrl.field.name);
            ctrl.ok();
        });
      };

      ctrl.reset = function () {
        ctrl.form.$setPristine();
        ctrl.form.$setUntouched();
        $state.forceReload();
      };

      ctrl.ok = function(newFieldObject, newFieldName) {
        $uibModalInstance.close({
          name: newFieldName,
          data: newFieldObject,
        });
      };

      ctrl.close = function () {
          $state.forceReload();
          $uibModalInstance.dismiss('cancel');
      };
    }]);
})();
