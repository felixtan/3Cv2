(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name clientApp.controller:AssignCarModalCtrl
   * @description
   * # AssignCarModalCtrl
   * Controller of the clientApp
   */
  angular.module('clientApp')
    .controller('AssignmentModalCtrl', ['_', 'datepicker', 'objectHelpers', 'objectType', 'subjectType', '$q', 'getTypes', 'getAssets', 'getCars', 'getDrivers', 'asset', 'subject', 'dataService', '$uibModalInstance', '$state',
      function (_, datepicker, objectHelpers, objectType, subjectType, $q, getTypes, getAssets, getCars, getDrivers, asset, subject, dataService, $uibModalInstance, $state) {

      var ctrl = this;
      ctrl.fullObjects = [];
      ctrl.simpleObjects = [];
      ctrl.subject = {};
      ctrl.subjectType = subjectType;
      ctrl.updateObj = null;
      ctrl.updateSubj = null;

      ctrl.datepicker = datepicker;
      ctrl.objIdentifier = null;   // get this from settings
      ctrl.formData = {};
      ctrl.objectType = objectType;
      ctrl.assetTypes = getTypes.data;

      if(ctrl.subjectType === 'driver') {
          // console.log("assignment modal called from driverProfile");
          ctrl.subject = subject;
          ctrl.updateSubj = dataService.updateDriver;
          ctrl.subjIdentifier = "Name" || null;

          if(ctrl.objectType === 'car') {
              ctrl.updateObj = dataService.updateCar;

              getCars().then(function(result) {
                  ctrl.fullObjects = result.data;
                  ctrl.objIdentifier = ctrl.fullObjects[0].identifier;
                  ctrl.simpleObjects = objectHelpers.simplify(ctrl.fullObjects);
              });
          } else if(ctrl.objectType === 'asset') {
              ctrl.updateObj = dataService.updateAsset;
              getAssets().then(function(result) {
                  ctrl.fullObjects = result.data;
                  ctrl.simpleObjects = objectHelpers.simplify(ctrl.fullObjects);
                  ctrl.objIdentifiers = _.uniq(_.map(ctrl.fullObjects, function(asset) {
                      return asset.assetType;
                  }));
              });
          } else {
            console.log(ctrl.objectType)
          }
      } else if(ctrl.subjectType === 'car') {
          // console.log("assignment modal called from carProfile");
          ctrl.subject = subject;
          ctrl.updateSubj = dataService.updateCar;
          ctrl.updateObj = dataService.updateDriver;
          ctrl.subjIdentifier = ctrl.subject.identifier;
          ctrl.objIdentifier = "Name" || null;
          getDrivers().then(function(result) {
              ctrl.fullObjects = result.data;
              ctrl.simpleObjects = objectHelpers.simplify(ctrl.fullObjects);
          })
      } else if(ctrl.subjectType === 'asset') {
          console.log("assignment modal called from assetProfile");
          ctrl.subject = asset;
          ctrl.updateSubj = dataService.updateAsset;
          ctrl.updateObj = dataService.updateDriver;
          ctrl.subjIdentifier = ctrl.subject.identifier;
          ctrl.objIdentifier = "Name" || null;
          getDrivers().then(function(result) {
              ctrl.fullObjects = result.data;
              ctrl.simpleObjects = objectHelpers.simplify(ctrl.fullObjects);
          })
      } else {
          console.log('assignment modal called from invalid state', $state.current);
      }

      ctrl.validForm = function() {
          return ((ctrl.formData.objId === null) || (typeof ctrl.formData.objId === "undefined"));
      };

      ctrl.reset = function () {
        ctrl.formData = {};
        ctrl.form.$setPristine();
        ctrl.form.$setUntouched();
        $state.forceReload();
      };

      ctrl.close = function () {
          $state.forceReload();
          $uibModalInstance.close('ok');
      };

      ctrl.getObjectIdentifierValue = function(id) {
          var deferred = $q.defer();
          var obj = _.find(ctrl.simpleObjects, function(obj) {
              return obj.id == id;
          });

          deferred.resolve(obj.identifierValue);
          deferred.reject('Failed to get identifier value');
          return deferred.promise;
      };

      ctrl.assignSubjectToObject = function() {
          console.log(ctrl.subjIdentifier);
          console.log(ctrl.subject);
          var subject = {
              id: ctrl.subject.id,
              identifier: {
                  name: ctrl.subjIdentifier,
                  value: ctrl.subject.data[ctrl.subjIdentifier].value,
              },
              assetType: (ctrl.subjectType === 'asset') ? ctrl.subject.assetType : null,
              dateAssigned: ctrl.datepicker.dt.getTime(),
              dateUnassigned: null
          };

          var obj = _.find(ctrl.fullObjects, function(object) {
              return object.id == ctrl.formData.objId;
          });

          // setting the correct reciprocal update call
          if(ctrl.objectType === 'driver') {
              if(ctrl.subjectType === 'car') {
                  obj.carsAssigned.push(subject);
              } else if(ctrl.subjectType === 'asset') {
                  obj.assetsAssigned.push(subject);
              }
          } else if(ctrl.objectType === 'car') {
              obj.driversAssigned.push(subject);
          } else if(ctrl.objectType === 'asset') {
              obj.driversAssigned.push(subject);
          } else {
              console.log('Invalid assignment operation', {
                  subject: ctrl.subjectType,
                  objects: ctrl.objectType
              });
          }

          ctrl.updateObj(obj);
      };

      // Assign object to subject
      ctrl.submit = function() {

          ctrl.getObjectIdentifierValue(ctrl.formData.objId).then(function(identifierValue) {
              var object = {
                  id: parseInt(ctrl.formData.objId),
                  identifier: {
                      name: ctrl.objIdentifier,
                      value: identifierValue
                  },
                  assetType: (ctrl.objectType === 'asset') ? ctrl.assetType : null,
                  dateAssigned: ctrl.datepicker.dt.getTime(),
                  dateUnassigned: null
              };

              if(ctrl.subjectType === 'driver') {
                  if(ctrl.objectType === 'car') {
                      ctrl.subject.carsAssigned.push(object);
                  } else if(ctrl.objectType === 'asset') {
                      ctrl.subject.assetsAssigned.push(object);
                  }

                  ctrl.updateSubj(ctrl.subject);
              } else if(ctrl.subjectType === 'car') {
                  ctrl.subject.driversAssigned.push(object);
                  ctrl.updateSubj(ctrl.subject);
              } else if(ctrl.subjectType === 'asset') {
                  ctrl.subject.driversAssigned.push(object);
                  ctrl.updateSubj(ctrl.subject);
              } else {
                  console.log('Invalid assignment operation', {
                      subject: ctrl.subjectType,
                      objects: ctrl.objectType
                  });
              }

              ctrl.assignSubjectToObject();
              ctrl.close();
          });
      };
    }]);
})();
