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
    .controller('AddObjectModalCtrl', ['$q', '_', 'getObjects', 'objectType', '$uibModal', 'objectHelpers', 'assetHelpers', 'prospectHelpers', 'carHelpers', 'driverHelpers', 'dataService', '$scope', '$uibModalInstance', '$state',
      function($q, _, getObjects, objectType, $uibModal, objectHelpers, assetHelpers, prospectHelpers, carHelpers, driverHelpers, dataService, $scope, $uibModalInstance, $state) {

      var ctrl = this;

      $scope.objects = getObjects;
      $scope.objectType = objectType;
      $scope.formData = {};                                     // Stores the addObjectModal form data
      $scope.identifier = { value: null };                      // Potentially new identifier of objectType
      $scope.currentIdentifier = { value: null };               // Identifier of objectType
      $scope.fields = [];                                       // Properties of objects of type objectType
      $scope.fieldsToHide = ["Name", "assetType", "status"];    // Properties of objects of type objectType to hide from addObjectModal form
      $scope.statuses = [];                                     // List of statuses for prospects. "status" is a property specific to prospects.
      $scope.status = {};                                       // status of a prospect ot be added.
      $scope.assetTypes = [];                                   // List of assetTypes for assets. "assetType" is a a property specific to assets.
      $scope.assetType = { value: null };                       // assetType of an asset to be added.

      // Overwritten if objectType = asset
      $scope.disableConditions = function() { return true; };

      $scope.hide = function(field) {
          return _.includes($scope.fieldsToHide, field);
      };

      $scope.invalidIdentifier = function(identifier) {
          return identifier.value === null || typeof identifier.value === 'undefined';
      };

      $scope.identifierChanged = function() {
          return $scope.identifier.value !== $scope.currentIdentifier.value;
      };

      $scope.disableAddField = function() {
          return objectType === "asset" && ($scope.formData.assetType === null || typeof $scope.formData.assetType === 'undefined');
      };

      // only for assets
      $scope.renderForm = null;

      // Determine the state or ui calling this modal
      if(objectType === 'driver') {
          ctrl.update = driverHelpers.update;
          ctrl.create = driverHelpers.createDriver;
          ctrl.save = driverHelpers.saveDriver;

          objectHelpers.getFormDataAndReference('driver').then(function(result) {
            $scope.currentIdentifier.value = "Name";
            angular.copy($scope.currentIdentifier, $scope.identifier);
            $scope.formData = result.formData;
            $scope.formData.assetType = { value: null };
          });
      } else if(objectType === 'car') {
          ctrl.update = carHelpers.update;
          ctrl.create = carHelpers.createCar;
          ctrl.save = carHelpers.saveCar;

          objectHelpers.getFormDataAndReference('car').then(function(result) {
              carHelpers.getIdentifier().then(function(identifier) {
                  $scope.formData = result.formData;
                  $scope.formData.assetType = { value: null };
                  $scope.fields = Object.keys(result.formData);
                  $scope.fields = _.without($scope.fields, "assetType");
                  $scope.currentIdentifier.value = identifier;
                  angular.copy($scope.currentIdentifier, $scope.identifier);
              });
          });
      } else if(objectType === 'prospect') {
          ctrl.update = prospectHelpers.update;
          ctrl.create = prospectHelpers.createProspect;
          ctrl.save = prospectHelpers.saveProspect;

          objectHelpers.getFormDataAndReference('prospect').then(function(result1) {
              prospectHelpers.getStatuses().then(function(result2) {
                  $scope.currentIdentifier.value = "Name";
                  angular.copy($scope.currentIdentifier, $scope.identifier);
                  $scope.statuses = result2.data.statuses;
                  $scope.formData = result1.formData;
                  $scope.formData.assetType = { value: null };
              });
          });
      } else if(objectType === 'asset') {
          ctrl.update = assetHelpers.update;
          ctrl.create = assetHelpers.createAsset;
          ctrl.save = assetHelpers.saveAsset;

          $scope.fieldsToHide.push("assetType");

          assetHelpers.getTypes().then(function(result){
              $scope.assetTypes = result.data.types;

              $scope.renderForm = function(assetType) {
                  objectHelpers.getFormDataAndReference('asset', assetType).then(function(result) {
                      $scope.currentIdentifier.value = result.referenceObject.identifier;
                      $scope.fields = Object.keys(result.formData);
                      $scope.formData = result.formData;
                      $scope.formData.assetType.value = assetType;
                      $scope.disableConditions = assetHelpers.invalidAssetType;
                      angular.copy($scope.currentIdentifier, $scope.identifier);
                  });
              };
          });
      } else {
          $state.go("dashboard.cars");
      }

      ctrl.updateIdentifierForAllObjects = function(idToIgnore, assetType) {
        var updates = [];
        var objects = (typeof assetType === 'string') ? assetHelpers.filterAssetsByType($scope.objects, assetType)
                                                      : $scope.objects;

        _.each(objects, function(o) {
          if (o.id !== idToIgnore) {
            if ($scope.identifier.value === $scope.newField) {
                o.data[$scope.newField].value = null;
            }

            o.identifier = $scope.identifier.value;
            updates.push(ctrl.update(o));
          }
        });

        $q.all(updates).then(function() {
          $state.forceReload();
        });
      };

      ctrl.setStatusForNewProspect = function(newProspect) {
        newProspect.status = {
            value: ($scope.status.value || defaultStatus.value)
        };

        newProspect.data.status = {
            value: ($scope.status.value || defaultStatus.value),
            log: false,
            dataType: 'text'
        };

        return newProspect;
      };

      $scope.submit = function() {
          var updateTasks = [];

          ctrl.create($scope.formData, $scope.identifier.value, $scope.formData.assetType.value).then(function(newObject) {
              if(objectType === 'car') {
                ctrl.save(newObject).then(function(result) {
                  if($scope.identifierChanged()) {
                    ctrl.updateIdentifierForAllObjects(result.data.id);
                  }

                  $scope.ok(newObject);
                });
              } else if(objectType === 'prospect') {
                  prospectHelpers.getDefaultStatus().then(function(defaultStatus) {
                      newObject = ctrl.setStatusForNewProspect(newObject);
                      ctrl.save(newObject).then(function() {
                          $scope.ok(newObject);
                      });
                  });
              } else if(objectType === 'driver') {
                  ctrl.save(newObject).then(function() {
                      $scope.ok(newObject);
                  });
              } else if(objectType === 'asset') {
                  ctrl.save(newObject).then(function(result) {
                    if($scope.identifierChanged()) {
                      ctrl.updateIdentifierForAllObjects(result.data.id, newObject.assetType);
                    }

                    $scope.ok(newObject);
                  });
              }
          });
      };

      $scope.reset = function () {
        $scope.formData = {};
        $scope.form.$setPristine();
        $scope.form.$setUntouched();
        $state.forceReload();
      };

      $scope.ok = function(object) {
          $uibModalInstance.close(object);
      };

      $scope.close = function () {
          $state.forceReload();
          $uibModalInstance.dismiss('close');
      };

      ctrl.updateModal = function(newField) {
          $scope.fields.push(newField.name);
          $scope.formData[newField.name] = newField.data;

          return $scope.formData;
      };

      $scope.addField = function(identifier) {
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'components/fields/addfieldmodal.html',
              controller: 'AddFieldModalCtrl',
              size: 'md',
              resolve: {
                  getObjects: function() {
                      return $scope.objects;
                  },
                  objectType: function() {
                      return objectType;
                  },
                  assetType: function() {
                      return objectType === 'asset' ? $scope.formData.assetType.value : null;
                  }
              }
          });

          modalInstance.result.then(function (newField) {
              $scope.fields.push(newField.name);
              $scope.formData[newField.name] = newField.data;
              $scope.newField = newField.name;

          }, function() {
            //   console.log('Modal dismissed at: ' + new Date());
          });
      };
    }]);
})();
