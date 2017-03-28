(function() {
  'use strict';

  angular.module('clientApp')
    .controller('EditFieldModalCtrl', ['$window', '_', 'objectHelpers', '$uibModal', 'dataService', 'getDrivers', 'getAssets', 'getProspects', 'getCars', '$uibModalInstance', '$state', '$scope', 'field', '_object', 'objectType', '$q', 'carHelpers', 'driverHelpers', 'prospectHelpers', 'assetHelpers',
      function ($window, _, objectHelpers, $uibModal, dataService, getDrivers, getAssets, getProspects, getCars, $uibModalInstance, $state, $scope, field, _object, objectType, $q, carHelpers, driverHelpers, prospectHelpers, assetHelpers) {

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

        // console.log($scope.object.status);
        // console.log(field);
        // console.log($scope.objectType);
        // console.log($scope.isProspectStatus(field));
        $scope.field = {
            name: field,
            type: $scope.object.data[field].type,
            dataType: $scope.object.data[field].dataType,
            value: $scope.isProspectStatus(field) ? $scope.object.status : $scope.object.data[field].value,
            log: $scope.object.data[field].log,
            identifier: $scope.object.identifier === field,
        };
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

      ctrl.updateLogStuff = function (object) {
        var deferred = $q.defer();

        if($scope.logValueChanged.value) {
          object.data[field].log = $scope.field.log;
          object.data[$scope.field.name].log = $scope.field.log;
          // console.log(object.data[field]);
          // console.log(object.data[$scope.field.name]);
          // console.log($scope.object);
          if($scope.field.log) {
            console.log('log value changed to true');
            _.each(object.logs, function(log) {
              log.data[$scope.field.name] = null;
              /*
                TODO:
                  Implement functions and inequalities for logs
                  1. It calculates value only if all requisite fields are also logged and have a value for a given log
              */
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

        deferred.resolve(object);
        deferred.reject(new Error("Error updating logs for field " + $scope.field.name));
        return deferred.promise;
      };

      $scope.submit = function() {
        if($scope.objectType === 'prospect' && $scope.field.name === 'status') {
          $scope.object.status = $scope.field.value;
          $scope.object.data[$scope.field.name].value = $scope.field.value.value;
          $scope.update($scope.object);
        } else {
          _.each($scope.objects, function(object) {
            /* If field name changed, all objects' data must be updated */
            var withUpdatedFieldName = objectHelpers.updateDataIfFieldNameChanged(field, $scope.field.name, object);

            /* If field name changed, all objects' logs must be updated */
            ctrl.updateLogStuff(withUpdatedFieldName).then(function(objectToSave) {
                // console.log('1 object:', objectToSave);
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

                $scope.update(objectToSave);
            });
          });
        }

        $scope.ok();
      };

      $scope.invalidFieldType = function() {
        return (($scope.field.type === null) || (typeof $scope.field.type === 'undefined') || ($scope.field.dataType === null) || (typeof $scope.field.dataType === 'undefined'));
      };

      $scope.reset = function () {
          ctrl.initialize();

          $scope.form.$setPristine();
          $scope.form.$setUntouched();
          $state.forceReload();
      };

      $scope.ok = function() {
        // $state.forceReload();
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

      //
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

      // when status name changes
      $scope.updateStatus = function(prospect) {
          console.log(prospect);
          var deferred = $q.defer();
          prospect.status.value = $scope.status;
          prospect.data.status.value = $scope.status;
          deferred.resolve(prospect);
          deferred.reject(new Error("Error updating status of prospect" + prospect.id));
          return deferred.promise;
      };

    }]);
})();
