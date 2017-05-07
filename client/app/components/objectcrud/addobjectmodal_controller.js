(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name clientApp.controller:AddObjectModalCtrl
   * @description
   * # AddObjectModalCtrl
   * Controller of the clientApp
   */
  angular.module('clientApp')
    .controller('AddObjectModalCtrl', ['$q', '_', 'getObjects', 'objectType', '$uibModal', 'objectHelpers', 'assetHelpers', 'prospectHelpers', 'carHelpers', 'driverHelpers', 'dataService', '$uibModalInstance', '$state',
      function($q, _, getObjects, objectType, $uibModal, objectHelpers, assetHelpers, prospectHelpers, carHelpers, driverHelpers, dataService, $uibModalInstance, $state) {

      var ctrl = this;

      ctrl.objects = getObjects;
      ctrl.objectType = objectType;
      ctrl.formData = {};                                     // Stores the addObjectModal form data
      ctrl.identifier = { value: null };                      // Potentially new identifier of objectType
      ctrl.initialIdentifier = { value: null };               // Identifier of objectType
      ctrl.fields = [];                                       // Properties of objects of type objectType
      ctrl.fieldsToHide = ["Name", "assetType", "status"];    // Properties of objects of type objectType to hide from addObjectModal form
      ctrl.statuses = [];                                     // List of statuses for prospects. "status" is a property specific to prospects.
      ctrl.status = {};                                       // status of a prospect ot be added.
      ctrl.assetTypes = [];                                   // List of assetTypes for assets. "assetType" is a a property specific to assets.
      ctrl.assetType = { value: null };                       // assetType of an asset to be added.

      ctrl.getIdentifier = getIdentifier;

      // Overwritten if objectType = asset
      ctrl.disableConditions = function() { return true; };

      ctrl.hide = function(field) {
          return _.includes(ctrl.fieldsToHide, field);
      };

      ctrl.invalidIdentifier = function(identifier) {
          return !identifier.value;
      };

       function identifierChanged() {
          return ctrl.identifier.value !== ctrl.initialIdentifier.value;
      };

      ctrl.disableAddField = function() {
          return objectType === "asset" && (ctrl.formData.assetType === null || typeof ctrl.formData.assetType === 'undefined');
      };

      // only for assets
      ctrl.renderForm = null;

      // Determine the state or ui calling this modal
      if(objectType === 'driver') {
          ctrl.update = driverHelpers.update;
          ctrl.create = driverHelpers.createDriver;
          ctrl.save = driverHelpers.saveDriver;
          ctrl.identifier.value = ctrl.initialIdentifier.value = ctrl.getIdentifier();
          objectHelpers.getFormDataAndReference('driver').then(function(result) {
            ctrl.initialIdentifier.value = "Name";
            ctrl.formData = result.formData;
            ctrl.formData.assetType = { value: null };
          });
      } else if(objectType === 'car') {
          ctrl.update = carHelpers.update;
          ctrl.create = carHelpers.createCar;
          ctrl.save = carHelpers.saveCar;
          ctrl.identifier.value = ctrl.initialIdentifier.value = ctrl.getIdentifier();
          objectHelpers.getFormDataAndReference('car').then(function(result) {
              ctrl.formData = result.formData;
              ctrl.formData.assetType = { value: null };
              ctrl.fields = Object.keys(result.formData);
              ctrl.fields = _.without(ctrl.fields, "assetType");
          });
      } else if(objectType === 'prospect') {
          ctrl.update = prospectHelpers.update;
          ctrl.create = prospectHelpers.createProspect;
          ctrl.save = prospectHelpers.saveProspect;
          ctrl.identifier.value = ctrl.initialIdentifier.value = "Name";
          objectHelpers.getFormDataAndReference('prospect').then(function(result1) {
              prospectHelpers.getStatuses().then(function(result2) {
                  ctrl.statuses = result2.data.statuses;
                  ctrl.formData = result1.formData;
                  ctrl.formData.assetType = { value: null };
              });
          });
      } else if(objectType === 'asset') {
          ctrl.update = assetHelpers.update;
          ctrl.create = assetHelpers.createAsset;
          ctrl.save = assetHelpers.saveAsset;

          ctrl.fieldsToHide.push("assetType");

          assetHelpers.getTypes().then(function(result){
              ctrl.assetTypes = result.data.types;

              ctrl.renderForm = function(assetType) {
                  objectHelpers.getFormDataAndReference('asset', assetType).then(function(result) {
                      ctrl.identifier.value = ctrl.initialIdentifier.value = result.referenceObject.identifier;
                      ctrl.fields = Object.keys(result.formData);
                      ctrl.formData = result.formData;
                      ctrl.formData.assetType.value = assetType;
                      ctrl.disableConditions = assetHelpers.invalidAssetType;
                  });
              };
          });
      } else {
          $state.go("dashboard.cars");
      }

      function getIdentifier () {
          return ctrl.objects[0].identifier ? ctrl.objects[0].identifier : null;
      }

      ctrl.updateIdentifierForAllObjects = function(idToIgnore, assetType) {
        var updates = [];
        var objects = (typeof assetType === 'string') ? assetHelpers.filterAssetsByType(ctrl.objects, assetType)
                                                      : ctrl.objects;

        _.each(objects, function(o) {
          if (o.id !== idToIgnore) {
            if (ctrl.identifier.value === ctrl.newField) {
                o.data[ctrl.newField].value = null;
            }

            o.identifier = ctrl.identifier.value;
            updates.push(ctrl.update(o));
          }
        });

        $q.all(updates).then(function() {
          $state.forceReload();
        });
      };

      ctrl.setStatusForNewProspect = function(newProspect) {
        newProspect.status = {
            value: (ctrl.status.value || defaultStatus.value)
        };

        newProspect.data.status = {
            value: (ctrl.status.value || defaultStatus.value),
            log: false,
            dataType: 'text'
        };

        return newProspect;
      };

      ctrl.submit = function() {
          var updateTasks = [];

          ctrl.create(ctrl.formData, ctrl.identifier.value, ctrl.formData.assetType.value).then(function(newObject) {
              if(objectType === 'car') {
                ctrl.save(newObject).then(function(result) {
                  if(identifierChanged()) {
                    ctrl.updateIdentifierForAllObjects(result.data.id);
                  }

                  ctrl.ok(newObject);
                });
              } else if(objectType === 'prospect') {
                  prospectHelpers.getDefaultStatus().then(function(defaultStatus) {
                      newObject = ctrl.setStatusForNewProspect(newObject);
                      ctrl.save(newObject).then(function() {
                          ctrl.ok(newObject);
                      });
                  });
              } else if(objectType === 'driver') {
                  ctrl.save(newObject).then(function() {
                      ctrl.ok(newObject);
                  });
              } else if(objectType === 'asset') {
                  ctrl.save(newObject).then(function(result) {
                    if(identifierChanged()) {
                      ctrl.updateIdentifierForAllObjects(result.data.id, newObject.assetType);
                    }

                    ctrl.ok(newObject);
                  });
              }
          });
      };

      ctrl.reset = function () {
        ctrl.formData = {};
        ctrl.form.$setPristine();
        ctrl.form.$setUntouched();
        $state.forceReload();
      };

      ctrl.ok = function(object) {
          $uibModalInstance.close(object);
      };

      ctrl.close = function () {
          $state.forceReload();
          $uibModalInstance.dismiss('close');
      };

      ctrl.updateModal = function(newField) {
          ctrl.fields.push(newField.name);
          ctrl.formData[newField.name] = newField.data;

          return ctrl.formData;
      };

      ctrl.forCarOrAsset = function() {
          return ctrl.objectType === "car" || ctrl.objectType === "asset";
      };

      ctrl.addField = function(identifier) {
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'components/fields/addfieldmodal.html',
              controller: 'AddFieldModalCtrl',
              controllerAs: 'addFieldModal',
              size: 'md',
              resolve: {
                  getObjects: function() {
                      return ctrl.objects;
                  },
                  objectType: function() {
                      return objectType;
                  },
                  assetType: function() {
                      return objectType === 'asset' ? ctrl.formData.assetType.value : null;
                  }
              }
          });

          modalInstance.result.then(function (newField) {
              ctrl.fields.push(newField.name);
              ctrl.formData[newField.name] = newField.data;
              ctrl.newField = newField.name;

          }, function() {
            //   console.log('Modal dismissed at: ' + new Date());
          });
      };
    }]);
})();
