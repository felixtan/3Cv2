(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name clientApp.controller:AddObjectModalInstanceCtrl
   * @description
   * # AddObjectModalInstanceCtrl
   * Controller of the clientApp
   */
  angular.module('clientApp')
    .controller('AddObjectModalInstanceCtrl', ['_', 'getCars', 'getAssets', 'getProspects', 'getDrivers', 'objectType', '$q', '$uibModal', 'objectHelpers', 'assetHelpers', 'prospectHelpers', 'carHelpers', 'driverHelpers', 'dataService', '$scope', '$uibModalInstance', '$state',
      function(_, getCars, getAssets, getProspects, getDrivers, objectType, $q, $uibModal, objectHelpers, assetHelpers, prospectHelpers, carHelpers, driverHelpers, dataService, $scope, $uibModalInstance, $state) {

      var ctrl = this;

      $scope.formData = {};                                     // Stores the addObjectModal form data
      $scope.objects = [];                                      // Existing objects of type objectType
      $scope.identifier = { value: null };                      // Potentially new identifier of objectType
      $scope.currentIdentifier = { value: null };               // Identifier of objectType
      $scope.fields = [];                                       // Properties of objects of type objectType
      $scope.fieldsToHide = ["Name", "assetType", 'status'];    // Properties of objects of type objectType to hide from addObjectModal form
      $scope.statuses = [];                                     // List of statuses for prospects. "status" is a property specific to prospects.
      $scope.status = {};                                       // status of a prospect ot be added.
      $scope.assetTypes = [];                                   // List of assetTypes for assets. "assetType" is a a property specific to assets.
      $scope.assetType = { value: null };                       // assetType of an asset to be added.
      $scope.objectType = objectType;                           // Attach objectType to $scope for testing.

      ctrl.getFormDataAndReference = function() {};

      $scope.create = function() {};

      $scope.update = function() {};

      $scope.save = function() {};

      $scope.disableConditions = function() { return true; };

      $scope.hide = function(field) {
          return _.includes($scope.fieldsToHide, field);
      };

      $scope.invalidIdentifier = function(identifier) {
          return ((identifier.value === null) || (typeof identifier.value === 'undefined')) ? true : false;
      };

      $scope.identifierChanged = function() {
          return ($scope.identifier.value !== $scope.currentIdentifier.value);
      };

      $scope.disableAddField = function() {
          return ((objectType === "asset") && (($scope.formData.assetType === null) || (typeof $scope.formData.assetType === 'undefined')));
      };

      // only for assets
      $scope.renderForm = function() {};

      // determine the state or ui calling this modal
      if(objectType === 'driver') {
          // console.log('called from drivers ui');
          $scope.objects = getDrivers.data;
          $scope.update = driverHelpers.updateDriver;
          $scope.create = driverHelpers.createDriver;
          $scope.save = driverHelpers.saveDriver;
          ctrl.getFormDataAndReference = objectHelpers.getFormDataAndReference;

          ctrl.getFormDataAndReference('driver').then(function(result) {
            // console.log('formData:', result.formData);
            // $scope.fieldsToHide.push("Name");
            // $scope.disableConditions = driverHelpers.namesNotNull;
            $scope.currentIdentifier.value = "Name";
            angular.copy($scope.currentIdentifier, $scope.identifier);
            $scope.formData = result.formData;
            $scope.formData.assetType = { value: null };
          });
      } else if(objectType === 'car') {
          // console.log('called from cars ui');
          $scope.objects = getCars.data;
          $scope.update = carHelpers.updateCar;
          $scope.create = carHelpers.createCar;
          $scope.save = carHelpers.saveCar;
          ctrl.getFormDataAndReference = objectHelpers.getFormDataAndReference;

          ctrl.getFormDataAndReference('car').then(function(result) {
              carHelpers.getIdentifier().then(function(identifier) {
                  // console.log('car form data:', result.formData);
                  $scope.formData = result.formData;
                  // $scope.fieldsToHide.concat(['fn', 'ineq']);
                  $scope.formData.assetType = { value: null };
                  $scope.fields = Object.keys(result.formData);
                  $scope.fields = _.without($scope.fields, "assetType");
                  $scope.currentIdentifier.value = identifier;
                  angular.copy($scope.currentIdentifier, $scope.identifier);
                  $scope.disableConditions = function(formData) { return true; };
              });
          });
      } else if(objectType === 'prospect') {
          // console.log('called from prospects ui');
          $scope.objects = getProspects.data;
          $scope.update = prospectHelpers.update;
          $scope.create = prospectHelpers.createProspect;
          $scope.save = prospectHelpers.saveProspect;
          ctrl.getFormDataAndReference = objectHelpers.getFormDataAndReference;

          ctrl.getFormDataAndReference('prospect').then(function(result1) {
              // console.log('result1:', result1);
              prospectHelpers.getStatuses().then(function(result2) {
                  // console.log('result2:', result2);
                  // console.log(statuses);
                  $scope.currentIdentifier.value = "Name";
                  angular.copy($scope.currentIdentifier, $scope.identifier);
                  $scope.statuses = result2.data.statuses;
                  // $scope.disableConditions = prospectHelpers.namesNotNull;

                  $scope.formData = result1.formData;
                  $scope.formData.assetType = { value: null };

                  // console.log(objectType + ' fields to hide:', $scope.fieldsToHide);
              });
          });
      } else if(objectType === 'asset') {
          // console.log('called from assets ui');
          $scope.objects = getAssets.data;
          $scope.update = assetHelpers.updateAsset;
          $scope.create = assetHelpers.createAsset;
          $scope.save = assetHelpers.saveAsset;
          $scope.fieldsToHide.push("assetType");
          ctrl.getFormDataAndReference = assetHelpers.getFormDataAndRepresentative;

          assetHelpers.getTypes().then(function(result){
              $scope.assetTypes = result.data.types;

              $scope.renderForm = function(assetType) {
                  // console.log('rendering form for ' + assetType);
                  objectHelpers.getFormDataAndReference('asset', assetType).then(function(result) {
                      // console.log(result);
                      $scope.currentIdentifier.value = result.referenceObject.identifier;
                      // assetHelpers.getIdentifier(assetType).then(function(identifier) {
                          $scope.fields = Object.keys(result.formData);
                          $scope.formData = result.formData;
                          $scope.formData.assetType.value = assetType;
                          $scope.disableConditions = assetHelpers.invalidAssetType;
                          angular.copy($scope.currentIdentifier, $scope.identifier);
                      // });
                  });
              };
          });
      } else {
          $state.go("dashboard.cars");
      }

      $scope.submit = function() {
          // console.log($scope.formData.assetType.value)
          $scope.create($scope.formData, $scope.identifier.value, $scope.formData.assetType.value).then(function(newObject) {
              // console.log(newObject);
              if(objectType === 'car') {
                  $scope.save(newObject).then(function(result) {
                      if($scope.identifierChanged()) {
                          _.each($scope.objects, function(obj) {
                              // console.log(obj.id);
                              // console.log(result.data.id);
                              if(obj.id !== result.data.id) {
                                  obj.identifier = $scope.identifier.value;
                                  $scope.update(obj);
                              }
                          });
                      }

                      $scope.ok(newObject);
                  });
              } else if(objectType === 'prospect') {
                  prospectHelpers.getDefaultStatus().then(function(defaultStatus) {

                      newObject.status = {
                          value: ($scope.status.value || defaultStatus.value)
                      };

                      newObject.data.status = {
                          value: ($scope.status.value || defaultStatus.value),
                          log: false,
                          type: 'text',
                          dataType: 'text'
                      };

                      $scope.save(newObject).then(function(result) {
                          if($scope.identifierChanged()) {
                              _.each($scope.objects, function(obj) {
                                  if(obj.id !== result.data.id) {
                                      obj.identifier = $scope.identifier.value;
                                      $scope.update(obj);
                                  }
                              });
                          }

                          $scope.ok(newObject);
                      });
                  });
              } else if(objectType === 'driver') {
                  // console.log(newObject);
                  $scope.save(newObject).then(function(result) {
                      console.log(result);
                      if($scope.identifierChanged()) {
                          _.each($scope.objects, function(obj) {
                              if(obj.id !== result.data.id) {
                                  obj.identifier = $scope.identifier.value;
                                  $scope.update(obj);
                              }
                          });
                      }

                      $scope.ok(newObject);
                  });
              } else if(objectType === 'asset') {
                  $scope.save(newObject).then(function(result) {
                      // console.log(result);
                      if($scope.identifierChanged()) {
                          var assetsOfType = assetHelpers.filterAssetsByType($scope.objects, result.data.assetType);
                          _.each(assetsOfType, function(asset) {
                              if(asset.id !== result.data.id) {
                                 asset.identifier = $scope.identifier.value;
                                  $scope.update(asset);
                              }
                          });
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
          $state.forceReload();
          $uibModalInstance.close(object);
      };

      $scope.close = function () {
          $state.forceReload();
          $uibModalInstance.dismiss('close');
      };

      ctrl.updateModal = function (newField) {
          var deferred = $q.defer();

          $scope.fields.push(newField.name);
          $scope.formData[newField.name] = newField.data;

          deferred.resolve($scope.formData);
          deferred.reject(new Error("Error updating add object modal after adding number/text/boolean field"));

          return deferred.promise;
      };

      $scope.addField = function(assetType) {

          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'views/addfieldmodal.html',
              controller: 'AddFieldModalInstanceCtrl',
              size: 'md',
              resolve: {
                  getCars: function(dataService) {
                      return (objectType === 'car') ? $scope.objects : {};
                  },
                  getDrivers: function(dataService) {
                      return (objectType === 'driver' ? $scope.objects : {});
                  },
                  getProspects: function(dataService) {
                      return (objectType === 'prospect' ? $scope.objects : {});
                  },
                  getAssets: function () {
                      return (objectType === 'asset' ? $scope.objects : {});
                  },
                  objectType: function() {
                      return objectType;
                  },
                  assetType: function() {
                      return objectType === 'asset' ? assetType : null;
                  }
              }
          });

          modalInstance.result.then(function (newField) {
              // console.log(newField);
              $scope.fields.push(newField.name);
              $scope.formData[newField.name] = newField.data;
          }, function() {
              $state.forceReload();
              console.log('Modal dismissed at: ' + new Date());
          });
      };
    }]);
})();
