(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name clientApp.controller:AddfieldmodalinstanceCtrl
   * @description
   * # AddfieldmodalinstanceCtrl
   * Controller of the clientApp
   */
  angular.module('clientApp')
    .controller('AddFieldModalInstanceCtrl', ['$scope', '$state', '$uibModalInstance', 'getObjects', 'dataService', 'objectHelpers', '_', 'objectType', 'assetType',
    function($scope, $state, $uibModalInstance, getObjects, dataService, objectHelpers, _, objectType, assetType) {

      var isValid = objectHelpers.isValid;

      var ctrl = this;
      ctrl.update = null;
      ctrl.fields = [];
      ctrl.objects = [];
      ctrl.objectType = objectType;
      ctrl.assetType = assetType;

      $scope.formData = {};

      /*
        Type of field     Data type
        -------------     ---------
        text              text
        number            number
        boolean           boolean
        function          number
        inequality        boolean
      */

      $scope.field = {  // when this value changes, the UI dynamically changes
        name: null,
        type: null,
        dataType: null,
      };

      $scope.setDataType = function(field) {
        switch(field) {
          case "text":
            $scope.field.dataType = "text";
            break;
          case "number":
            $scope.field.dataType = "number";
            break;
          case "boolean":
            $scope.field.dataType = "boolean";
            break;
          default:
            $scope.field.dataType = undefined;
            break;
        }
      };

      $scope.invalidFieldType = function() {
        return (($scope.field.type === null) || (typeof $scope.field.type === 'undefined') || ($scope.field.dataType === null) || (typeof $scope.field.dataType === 'undefined'));
      };

      if(objectType === 'car') {

        ctrl.update = dataService.updateCar;
        if(typeof getObjects !== 'undefined' && getObjects.length > 0) { ctrl.objects = getObjects; }

      } else if(objectType === 'driver') {

        ctrl.update = dataService.updateDriver;
        if(typeof getObjects !== 'undefined' && getObjects.length > 0) { ctrl.objects = getObjects; }

      } else if(objectType === 'prospect') {

        ctrl.update = dataService.updateProspect;
        if(typeof getObjects !== 'undefined' && getObjects.length > 0) { ctrl.objects = getObjects; }

      } else if(objectType === 'asset') {
        ctrl.update = dataService.updateAsset;

        var assetsOfType = _.filter(getObjects, function(asset) {
          return asset.assetType === ctrl.assetType;
        });

        if(assetsOfType !== 'undefined' && assetsOfType.length > 0) { ctrl.objects = assetsOfType; }

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
          log: $scope.formData.log || false,
          dataType: field.dataType,
          type: field.type,
        };
      };

      ctrl.appendNewFieldToObject = function(fieldName, fieldDataObj, object) {
        object.data[fieldName] = fieldDataObj;
        return object;
      };

      $scope.submit = function() {
        var fieldDataObj = ctrl.createNewFieldData($scope.field);

        if(ctrl.objects.length > 0) {
          _.each(ctrl.objects, function(object) {
            var objectToUpdate = ctrl.appendNewFieldToObject($scope.field.name, fieldDataObj, object);
            ctrl.update(objectToUpdate);
          });
        }

        $scope.ok(fieldDataObj, $scope.field.name);
      };

      $scope.reset = function () {
        $scope.formData = {};
        $scope.form.$setPristine();
        $scope.form.$setUntouched();
        $state.forceReload();
      };

      $scope.ok = function(newFieldObject, newFieldName) {
        $state.forceReload();
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
