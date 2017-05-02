(function() {
  'use strict';

  angular.module('clientApp')
    .controller('EditFieldModalCtrl', ['$q', '$window', '_', 'objectHelpers', '$uibModal', 'dataService', 'getDrivers', 'getAssets', 'getProspects', 'getCars', '$uibModalInstance', '$state', '$scope', 'field', '_object', 'objectType', 'carHelpers', 'driverHelpers', 'prospectHelpers', 'assetHelpers',
      function ($q, $window, _, objectHelpers, $uibModal, dataService, getDrivers, getAssets, getProspects, getCars, $uibModalInstance, $state, $scope, field, _object, objectType, carHelpers, driverHelpers, prospectHelpers, assetHelpers) {

      var ctrl = this,
          notName = driverHelpers.notName;

      $scope.fieldNamesNotToEdit = [];
      $scope.statuses = null;
      $scope.prospectStatuses = null;

      $scope.loggable = function (fieldName) {
        if($scope.objectType !== 'prospect') {
          return notName(fieldName);
        } else {
          return false;
        }
      };

      String.prototype.capitalizeIfStatus = function() {
          return (this === 'status' && $scope.objectType === "prospect") ? (this.charAt(0).toUpperCase() + this.slice(1)) : this;
      };

      $scope.dontEditFieldName = function(fieldName) {
        return _.includes($scope.fieldNamesNotToEdit, fieldName);
      };

      $scope.isProspectStatus = function(fieldName) {
        return $scope.objectType === 'prospect' && fieldName === 'status';
      };

      // INITIALIZE
      ctrl.initialize = function() {
        $scope.logValueChanged = { value: false };
        $scope.object = _object;
        $scope.fields = _.without(Object.keys($scope.object.data), field);
        $scope.objects = [];
        $scope.objectType = objectType;

        $scope.field = {
            name: field,
            dataType: $scope.object.data[field].dataType,
            value: $scope.isProspectStatus(field) ? $scope.object.status : $scope.object.data[field].value,
            log: $scope.object.data[field].log,
            identifier: $scope.object.identifier === field,
        };

        console.log($scope.field)
      };
      ctrl.initialize();

      if(objectType === 'car') {
          $scope.update = carHelpers.update;
          $scope.objects = getCars;
      } else if(objectType === 'driver') {
        $scope.fieldNamesNotToEdit.push("First Name", "Last Name");
          $scope.update = driverHelpers.update;
          $scope.objects = getDrivers;
      } else if(objectType === 'prospect') {
          $scope.fieldNamesNotToEdit.push("status", "First Name", "Last Name");
          $scope.update = prospectHelpers.update;
          $scope.objects = getProspects;
          prospectHelpers.getStatuses().then(function(result) {
            $scope.prospectStatuses = result.data;
            $scope.statuses = $scope.prospectStatuses.statuses;
          });
      } else if (objectType === 'asset') {
          $scope.update = assetHelpers.update;
          // $scope.objects = assetHelpers.getAssetsOfType($scope.object.assetType);
          $scope.objects = getAssets;
      } else {
          $window.alert('Unrecognized object type!');
      }

      $scope.fieldNameAlreadyExists = function () {
        return _.includes($scope.fields, $scope.field.name);
      };

      ctrl.pruneFieldData = function (fieldData) {
        var data = {};

        angular.copy(fieldData, data);

        delete data.identifier;
        delete data.name;

        return data;
      };

      ctrl.updateLogStuff = function(object) {
        if($scope.logValueChanged.value) {
          object.data[field].log = $scope.field.log;
          object.data[$scope.field.name].log = $scope.field.log;

          // Only if the field isn't already being logged
          if($scope.field.log) {
            _.each(object.logs, function(log) {
              if (!log.data[$scope.field.name]) {
                  log.data[$scope.field.name] = null;
              }
            });
          }
        } else {
          /*
            1. log value didn't change
            2. log value is true
            3. field name changed
          */
          if($scope.field.log && $scope.field.name !== field) {
            _.each(object.logs, function(log) {
              log.data[$scope.field.name] = log.data[field];
              delete log.data[field];
            });
          }
        }

        return object;
      };

      $scope.submit = function() {
        var updates = [];

        if($scope.objectType === 'prospect' && $scope.field.name === 'status') {
          $scope.object.status = $scope.field.value;
          $scope.object.data[$scope.field.name].value = $scope.field.value.value;
          updates.push($scope.update($scope.object));
        } else {
          _.each($scope.objects, function(object) {
            /* If field name changed, all objects' data must be updated */
            var withUpdatedFieldName = objectHelpers.updateDataIfFieldNameChanged(field, $scope.field.name, object);

            /* If field name changed, all objects' logs must be updated */
            var objectToSave = ctrl.updateLogStuff(withUpdatedFieldName);

            ctrl.pruneFieldData(objectToSave.data[$scope.field.name]);

            // identifier changed?
            if($scope.field.identifier) {
              objectToSave.identifier = $scope.field.name;
            }

            // Update the field's value
            if($scope.object.id === objectToSave.id) {

              // if driver/prospect Last Name and/or First Name was changed, then update Name
              if ($scope.objectType === 'prospect' || $scope.objectType === 'driver') {

                if($scope.field.name === "First Name") {
                  objectToSave.data.Name.value = $scope.field.value + " " + objectToSave.data["Last Name"].value;
                } else if($scope.field.name === "Last Name") {
                  objectToSave.data.Name.value = objectToSave.data["First Name"].value + " " + $scope.field.value;
                } else {
                  objectToSave.data[$scope.field.name].value = $scope.field.value;
                }

              } else {
                objectToSave.data[$scope.field.name].value = $scope.field.value;
              }
            }

            updates.push($scope.update(objectToSave));
          });
        }

        $q.all(updates).then(function() {
          $state.forceReload();
          $scope.ok();
        });
      };

      $scope.invalidFieldType = function() {
        return $scope.field.dataType === null || typeof $scope.field.dataType === 'undefined';
      };

      $scope.reset = function () {
          ctrl.initialize();
          $scope.form.$setPristine();
          $scope.form.$setUntouched();
          $state.forceReload();
      };

      $scope.ok = function() {
        $uibModalInstance.close();
      };

      $scope.close = function () {
          // $state.forceReload();
          $uibModalInstance.dismiss('cancel');
      };

      $scope.delete = function () {
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'views/deletefieldmodal.html',
              controller: 'DeleteFieldModalInstanceCtrl',
              size: 'md',
              resolve: {
                  thing: function() {
                      return {
                        fieldName: $scope.field.name,
                        type: 'field',
                      };
                      // object { type: x, value: y } such that x ∈ ['field', 'log'] and y ∈ $scope.fields or $scope.dates
                  },
                  getCars: function() {
                      return (($scope.objectType === 'car') ? $scope.objects : {});
                  },
                  getDrivers: function() {
                      return (($scope.objectType === 'driver') ? $scope.objects : {});
                  },
                  getProspects: function() {
                      return (($scope.objectType === 'prospect') ? $scope.objects : {});
                  },
                  getAssets: function() {
                      return (($scope.objectType === 'prospect') ? $scope.objects : {});
                  },
                  objectType: function() {
                    return $scope.objectType;
                  }
              }
          });

          modalInstance.result.then(function () {
              $scope.ok();
          }, function () {
              console.log('Modal dismissed at: ' + new Date());
          });
      };

      // Prospect edit field stuff
      ////////////////////////////////////////////////////////////

      $scope.setStatusChanged = function(statusName) {
          var prospect = $scope.object;
          if((prospect.status.value != statusName) ||
            (prospect.data.status.value != statusName) &&
            (typeof statusName !== 'undefined') &&
            (statusName !== null)) {
              $scope.statusChanged = true;
              $scope.status = statusName;
          }
      };

    }]);
})();
