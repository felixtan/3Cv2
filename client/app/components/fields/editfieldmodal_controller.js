(function() {
  'use strict';

  angular.module('clientApp')
    .controller('EditFieldModalCtrl', ['$q', '$window', '_', 'objectHelpers', '$uibModal', 'dataService', 'getObjects', '$uibModalInstance', '$state', 'field', '_object', 'objectType', 'carHelpers', 'driverHelpers', 'prospectHelpers', 'assetHelpers',
      function ($q, $window, _, objectHelpers, $uibModal, dataService, getObjects, $uibModalInstance, $state, field, _object, objectType, carHelpers, driverHelpers, prospectHelpers, assetHelpers) {

      var ctrl = this
      ,   notName = driverHelpers.notName;

      ctrl.objects = getObjects;
      ctrl.fieldNamesNotToEdit = [];
      ctrl.statuses = null;
      ctrl.prospectStatuses = null;
      ctrl.originalName = field;

      ctrl.loggable = function (fieldName) {
        if(ctrl.objectType !== 'prospect') {
          return notName(fieldName);
        } else {
          return false;
        }
      };

      ctrl.capitalizeIfStatus = function(str) {
          return (str === 'status' && ctrl.objectType === "prospect") ? (str.charAt(0).toUpperCase() + str.slice(1)) : str;
      };

      ctrl.dontEditFieldName = function(fieldName) {
        return _.includes(ctrl.fieldNamesNotToEdit, fieldName);
      };

      ctrl.isProspectStatus = function(fieldName) {
        return ctrl.objectType === 'prospect' && fieldName === 'status';
      };

      // INITIALIZE
      ctrl.initialize = function() {
        ctrl.logValueChanged = { value: false };
        ctrl.object = _object;
        ctrl.fields = _.without(Object.keys(ctrl.object.data), field);
        ctrl.objectType = objectType;

        ctrl.field = {
            name: ctrl.originalName,
            dataType: ctrl.object.data[field].dataType,
            value: ctrl.isProspectStatus(field) ? ctrl.object.status : ctrl.object.data[field].value,
            log: ctrl.object.data[field].log,
            isIdentifier: ctrl.object.identifier === field,
        };
      };
      ctrl.initialize();

      if(objectType === 'car') {
          ctrl.update = carHelpers.update;
      } else if(objectType === 'driver') {
        ctrl.fieldNamesNotToEdit.push("First Name", "Last Name");
          ctrl.update = driverHelpers.update;
      } else if(objectType === 'prospect') {
          ctrl.fieldNamesNotToEdit.push("status", "First Name", "Last Name");
          ctrl.update = prospectHelpers.update;
          prospectHelpers.getStatuses().then(function(result) {
            ctrl.prospectStatuses = result.data;
            ctrl.statuses = ctrl.prospectStatuses.statuses;
          });
      } else if (objectType === 'asset') {
          ctrl.update = assetHelpers.update;
      } else {
          $window.alert('Unrecognized object type!');
      }

      ctrl.fieldNameAlreadyExists = function () {
        return _.includes(ctrl.fields, ctrl.field.name);
      };

      ctrl.pruneFieldData = function (fieldData) {
        var data = {};

        angular.copy(fieldData, data);

        delete data.identifier;
        delete data.name;

        return data;
      };

      ctrl.updateLogStuff = function(object) {
        if(ctrl.logValueChanged.value) {

        //   object.data[ctrl.originalName].log = ctrl.field.log;
          object.data[ctrl.field.name].log = ctrl.field.log;

          // Only if the field isn't already being logged
          if(ctrl.field.log) {
            _.each(object.logs, function(log) {
              if (!log.data[ctrl.field.name]) {
                  log.data[ctrl.field.name] = null;
              }
            });
          }
        } else {
          /*
            1. log value didn't change
            2. log value is true
            3. field name changed
          */
          if(ctrl.field.log && ctrl.field.name !== field) {
            _.each(object.logs, function(log) {
              log.data[ctrl.field.name] = log.data[field];
              delete log.data[field];
            });
          }
        }

        return object;
      };

      ctrl.submit = function() {
          var updates = [];

          if(ctrl.objectType === 'prospect' && ctrl.field.name === 'status') {
              ctrl.object.status = ctrl.field.value;
              ctrl.object.data[ctrl.field.name].value = ctrl.field.value.value;
              updates.push(ctrl.update(ctrl.object));
          } else {
              _.each(ctrl.objects, function(object) {
                  /* If field name changed, all objects' data must be updated */
                  var withUpdatedFieldName = objectHelpers.updateDataIfFieldNameChanged(field, ctrl.field.name, object);

                  /* If field name changed, all objects' logs must be updated */
                  var objectToSave = ctrl.updateLogStuff(withUpdatedFieldName);
                  
                  ctrl.pruneFieldData(objectToSave.data[ctrl.field.name]);

                  // identifier changed?
                  if(ctrl.field.isIdentifier) {
                      objectToSave.identifier = ctrl.field.name;
                  }

                  // Update the field's value
                  if(ctrl.object.id === objectToSave.id) {

                      // if driver/prospect Last Name and/or First Name was changed, then update Name
                      if (ctrl.objectType === 'prospect' || ctrl.objectType === 'driver') {

                          if(ctrl.field.name === "First Name") {
                              objectToSave.data.Name.value = ctrl.field.value + " " + objectToSave.data["Last Name"].value;
                          } else if(ctrl.field.name === "Last Name") {
                              objectToSave.data.Name.value = objectToSave.data["First Name"].value + " " + ctrl.field.value;
                          } else {
                              objectToSave.data[ctrl.field.name].value = ctrl.field.value;
                          }

                      } else {
                          objectToSave.data[ctrl.field.name].value = ctrl.field.value;
                      }
                  }

                  updates.push(ctrl.update(objectToSave));
              });
          }

        $q.all(updates).then(function() {
          $state.forceReload();
          ctrl.ok();
        });
      };

      ctrl.invalidFieldType = function() {
        return ctrl.field.dataType === null || typeof ctrl.field.dataType === 'undefined';
      };

      ctrl.reset = function () {
          ctrl.initialize();
          ctrl.form.$setPristine();
          ctrl.form.$setUntouched();
          $state.forceReload();
      };

      ctrl.ok = function() {
        $uibModalInstance.close();
      };

      ctrl.close = function () {
          // $state.forceReload();
          $uibModalInstance.dismiss('cancel');
      };

      ctrl.delete = function () {
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'components/fields/deletemodal.html',
              controller: 'DeleteModalCtrl',
              controllerAs: 'deleteModal',
              size: 'md',
              resolve: {
                  thing: function() {
                      return {
                        fieldName: ctrl.field.name,
                        type: 'field',
                      };
                      // object { type: x, value: y } such that x ∈ ['field', 'log'] and y ∈ ctrl.fields or ctrl.dates
                  },
                  getObjects: function() {
                      return ctrl.objects;
                  },
                  objectType: function() {
                    return ctrl.objectType;
                  }
              }
          });

          modalInstance.result.then(function () {
              ctrl.ok();
          }, function () {
            //   console.log('Modal dismissed at: ' + new Date());
          });
      };

      // Prospect edit field stuff
      ////////////////////////////////////////////////////////////

      ctrl.setStatusChanged = function(statusName) {
          var prospect = ctrl.object;
          if((prospect.status.value != statusName) ||
            (prospect.data.status.value != statusName) &&
            (typeof statusName !== 'undefined') &&
            (statusName !== null)) {
              ctrl.statusChanged = true;
              ctrl.status = statusName;
          }
      };

    }]);
})();
