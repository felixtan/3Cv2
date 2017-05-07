(function() {
  'use strict';

  angular.module('clientApp')
    .controller('ObjectDataCtrl', ['_', 'objectType', 'objectId', 'objectHelpers', 'assetHelpers', 'prospectHelpers', 'driverHelpers', 'carHelpers', '$q', '$state', '$scope', '$uibModal',
      function(_, objectType, objectId, objectHelpers, assetHelpers, prospectHelpers, driverHelpers, carHelpers, $q, $state, $scope, $uibModal) {

      var ctrl = this;
      // ctrl.assetType = { value: null };
      $scope.objectType = objectType;
      $scope.carIdentifier = null;
      $scope.tabs = [];

      $scope.valid = function (thing) {
          return thing !== null && typeof thing !== "undefined";
      };

      ctrl.getObjectById = function () {
          if($scope.objectType === 'car') {
              return carHelpers.getById;
          } else if($scope.objectType === 'driver') {
              // console.log($scope.stateRef);
              carHelpers.getIdentifier().then(function(identifier) {
                  $scope.carIdentifier = identifier;
              });

              return driverHelpers.getById;
          } else if($scope.objectType === 'prospect') {
              return prospectHelpers.getById;
          } else if($scope.objectType === 'asset') {
              return assetHelpers.getById;
          }
      };

      ctrl.getObjects = function (assetType) {
          if($scope.objectType === 'car') {
              return carHelpers.get;
          } else if($scope.objectType === 'driver') {
              return driverHelpers.get;
          } else if($scope.objectType === 'prospect') {
              return prospectHelpers.get;
          } else if($scope.objectType === 'asset') {
              return assetHelpers.getByType;
          }
      };

      ctrl.getObjectById()(objectId).then(function(result1) {
          // console.log(result1);
          if(result1) {
            $scope.object = result1.data;
          }

          ctrl.assetType = $scope.object.assetType;
          $scope.identifierValue = $scope.object.data[$scope.object.identifier].value;

          $scope.tabs = [
              { title: 'Data', stateRef: objectHelpers.getStateRef($scope.objectType, $scope.object.id, 'Data') },
              { title: 'Logs', stateRef: objectHelpers.getStateRef($scope.objectType, $scope.object.id, 'Logs') }
          ];

          ctrl.getObjects()($scope.object.assetType).then(function(result2) {
              ctrl.objects = result2.data;
          });
      });

      // Add field
      $scope.addField = function() {
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'components/fields/addfieldmodal.html',
              controller: 'AddFieldModalCtrl',
              controllerAs: 'addFieldModal',
              size: 'md',
              resolve: {
                  getObjects: function() {
                      return ctrl.objects
                  },
                  assetType: function() {
                      return $scope.objectType === 'asset' ? ctrl.assetType : null;
                  },
                  objectType: function() {
                      return $scope.objectType;
                  }
              }
          });

          modalInstance.result.then(function () {
              $state.forceReload();
          }, function() {
              $state.forceReload();
              console.log('Modal dismissed at: ' + new Date());
          });
      };

      /////////////////////////////
      // Driver Assignment UI /////
      /////////////////////////////

      $scope.assign = function(thing) {
          // console.log(`Assign ${thing} to ${$scope.objectType}`)
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'components/assignment/assignmentmodal.html',
              controller: 'AssignmentModalCtrl',
              controllerAs: 'assignModal',
              size: 'md',
              resolve: {
                  getDrivers: function() {
                      return $scope.objectType === 'car' ? driverHelpers.get : null;
                  },
                  getCars: function() {
                      return ($scope.objectType === 'driver' && thing === 'car') ? carHelpers.get : null;
                  },
                  subject: function() {
                      return $scope.object
                  },
                  subjectType: function() {
                      return $scope.objectType;
                  },
                  objectType: function() {
                      return thing;
                  },
                  getTypes: function() {
                      return ($scope.objectType === 'driver' && thing === 'asset') ? assetHelpers.getTypes : { data: null };
                  },
                  getAssets: function() {
                      return ($scope.objectType === 'driver' && thing === 'asset') ? assetHelpers.get : null;
                  },
                  asset: function() {
                      return $scope.objectType === 'asset' ? driverHelpers.get : null;
                  },
              }
          });

          modalInstance.result.then(function (input) {
              console.log('passed back from AssignmentModalCtrl:', input);
          }, function () {
              console.log('Modal dismissed at: ' + new Date());
          });
      };

      $scope.editField = function(object, field) {
          // console.log(object);
          // console.log(field);
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'components/fields/editfieldmodal.html',
              controller: 'EditFieldModalCtrl',
              controllerAs: 'editFieldModal',
              size: 'md',
              resolve: {
                  field: function() {
                      return field;
                  },
                  _object: function() {
                      return object;
                  },
                  objectType: function() {
                      return $scope.objectType;
                  },
                  getCars: function() {
                      // console.log(ctrl.objects);
                      return $scope.objectType === 'car' ? ctrl.objects : [];
                  },
                  getProspects: function() {
                      return $scope.objectType === 'prospect' ? ctrl.objects : [];
                  },
                  getDrivers: function() {
                      return $scope.objectType === 'driver' ? ctrl.objects : [];
                  },
                  getAssets: function() {
                      return $scope.objectType === 'asset' ? ctrl.objects : [];
                  }
              }
          });

          modalInstance.result.then(function () {
              // console.log('passed back from EditFieldModalCtrl:', input);
              $state.forceReload();
          }, function () {
              console.log('Modal dismissed at: ' + new Date());
              $state.forceReload();
          });
      };

      //
      // Prospect data stuff
      /////////////////////////////////////////////////
      $scope.notName = function(field) {
          // console.log(field);
          return ($scope.objectType === "prospect" || $scope.objectType === 'driver') && field === "Name" || field === 'assetType';
      };

      $scope.notStatus = function(field) {
          return (field.toLowerCase() !== "status");
      };

      String.prototype.capitalizeIfStatus = function() {
          return (this === 'status' && $scope.objectType === "prospect") ? (this.charAt(0).toUpperCase() + this.slice(1)) : this;
      };

      $scope.notNameOrStatus = function(field) {
          return ((field !== "First Name") && (field !== "Last Name") && (field !== "Name") && (field.toLowerCase() !== "status"));
      };

      // If field exists in fields, then append "~" to front of field until the conflict is resolved.
      ctrl.getUniqueFieldName = function(fields, field) {
          return (_.includes(fields, field)) ? ctrl.getUniqueFieldName(fields, "~" + field) : field;
      };

      ctrl.partitionFields = function(prospectData, driverData) {
          var prospectFields = Object.keys(prospectData)
          var driverFields = Object.keys(driverData)
          var inCommon = _.intersection(prospectFields, driverFields)
          var uniqueToProspect = _.difference(prospectFields, driverFields.concat('status'))      // We do not want drivers to have prospect's "status" field
          var uniqueToDriver = _.difference(driverFields, prospectFields)

          return {
            inCommon          : inCommon,
            uniqueToDriver    : uniqueToDriver,
            uniqueToProspect  : uniqueToProspect
          }
      };

      // used in convert
      ctrl.splitProspectData = function (driverData, prospectData, fieldsInCommon) {
          var prospectDataMinusFieldsInCommon = {};
          var prospectDataOnlyFieldsInCommon = {};
          angular.copy(prospectData, prospectDataMinusFieldsInCommon);

          var prospectFieldsToAddToAllDrivers = _.difference(Object.keys(prospectData), Object.keys(driverData));
          // console.log(Object.keys(driverData));
          // console.log(Object.keys(prospectData));
          // console.log(prospectFieldsToAddToAllDrivers);

          prospectFieldsToAddToAllDrivers = _.reject(prospectFieldsToAddToAllDrivers, function(field) {
              return _.includes(Object.keys(driverData), field);
          });

          _.each(fieldsInCommon, function(field) {
              delete prospectDataMinusFieldsInCommon[field];
              prospectDataOnlyFieldsInCommon[field] = prospectData[field];
              if(prospectHelpers.notName(field)) {
                  var renamedField = ctrl.getUniqueFieldName(Object.keys(driverData), field);
                  prospectFieldsToAddToAllDrivers.push(renamedField);
                  prospectDataOnlyFieldsInCommon[renamedField] = prospectDataOnlyFieldsInCommon[field];
                  delete prospectDataOnlyFieldsInCommon[field];
              }
          });

          // prospectDataFieldsUnCommon: prospectDataFieldsUnCommon,
          // prospectDataFieldsInCommon: prospectDataFieldsInCommon,
          return _.without(prospectFieldsToAddToAllDrivers, "status");
      };

      /*
          Changes the name of prospect fields if they conflict with names of driver fields
      */
      ctrl.resolveNameConflicts = function (partedFields, prospectData) {
          _.each(partedFields.uniqueToProspect, function(field) {
              var temp = ctrl.getUniqueFieldName(partedFields.uniqueToDriver, field);

              if (temp !== field) {
                  partedFields.uniqueToProspect[_.indexOf(partedFields.uniqueToProspect, field)] = temp;
                  prospectData[temp] = prospectData[field];
                  delete prospectData[field];
              }
          });

          return {
              partedFields: partedFields,
              prospectData: prospectData,
          };
      };

      // Adds unique prospect fields to all drivers, renaming if necessary
      // Returns data of first updated driver
      ctrl.addProspectFieldsToExistingDrivers = function (fieldsUniqueToProspect, prospectData) {
          var deferred = $q.defer(),
              fields = fieldsUniqueToProspect;

          driverHelpers.get().then(function(result) {
              var drivers = result.data;
              if(typeof drivers !== 'undefined' && drivers !== null && drivers.length) {
                if(fields.length) {
                  _.each(drivers, function(driver, index, list) {
                      _.each(fields, function(field) {
                          driver.data[field] = {
                              value: null,
                              log: false,
                              dataType: prospectData[field].dataType
                          };

                          if (driver.data.status) {
                            delete driver.data.status;
                          }

                          // Runs regardless of whether fieldsUniqueToProspect >= 0
                          driverHelpers.update(driver).then(function(result) {
                              if(index === 0) {
                                  deferred.resolve(result.config.data.data);
                                  deferred.reject(new Error("Error getting updated driver data after adding prospect fields"));
                              }
                          });
                      });
                  });
                } else {
                  deferred.resolve(prospectData);
                }
              } else {
                  deferred.resolve(prospectData);
                  deferred.reject(new Error("Error getting updated driver data after adding prospect fields: drivers is undefined or null"));
              }
          });

          return deferred.promise;
      };

      ctrl.buildNewDriverData = function(_prospectData, _partedFields) {
          var prospectData = _prospectData
          var partedFields = _partedFields

          _.each(prospectData, function(data, field) {
              // var temp = field.replace(/~/g, "");
              if(_.includes(partedFields.inCommon, field) || _.includes(partedFields.uniqueToProspect, field)) {
                  prospectData[field] = $scope.object.data[field];
              } else {
                  prospectData[field].value = null;
              }
          });

          return prospectData
      };

      $scope.convert = function() {
        objectHelpers.getFormDataAndReference('driver').then(function(driver) {
          var fields = ctrl.partitionFields($scope.object.data, driver.referenceObject.data)
          var result = ctrl.resolveNameConflicts(fields, $scope.object.data);

          ctrl.addProspectFieldsToExistingDrivers(result.partedFields.uniqueToProspect, result.prospectData).then(function(prospectDataWithNoConflictingFields) {
            var newDriverData = ctrl.buildNewDriverData(prospectDataWithNoConflictingFields, result.partedFields)

            driverHelpers.createDriver(newDriverData).then(function(newDriver) {

              if(newDriver.data.status) {
                delete newDriver.data.status;
              }

              driverHelpers.saveDriver(newDriver).then(function() {
                prospectHelpers.deleteProspect($scope.object.id);
                $state.go('dashboard.prospects');
              });
            });
          });
        });
      };

      // Delete modal
      $scope.openDeleteModal = function() {
        // console.log(objectId)
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'components/objectcrud/deleteobjmodal.html',
          controller: 'DeleteObjModalCtrl',
          controllerAs: 'deleteObjModal',
          size: 'md',
          resolve: {
            id: function() {
              return objectId;
            }
          }
        });

        modalInstance.result.then(function() {
            // $state.forceReload();
        });
      };
    }]);
})();
