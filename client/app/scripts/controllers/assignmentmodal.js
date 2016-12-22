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
    .controller('AssignmentModalCtrl', ['_', 'datepicker', 'objectHelpers', 'objectType', 'subjectType', '$q', '$scope', 'getTypes', 'getAssets', 'getCars', 'getDrivers', 'asset', 'subject', 'dataService', '$uibModalInstance', '$state',
      function (_, datepicker, objectHelpers, objectType, subjectType, $q, $scope, getTypes, getAssets, getCars, getDrivers, asset, subject, dataService, $uibModalInstance, $state) {

      var ctrl = this;
      $scope.fullObjects = [];
      $scope.simpleObjects = [];
      $scope.subject = {};
      $scope.subjectType = subjectType;
      $scope.updateObj = null;
      $scope.updateSubj = null;

      $scope.datepicker = datepicker;
      $scope.objIdentifier = null;   // get this from settings
      $scope.formData = {};
      $scope.objectType = objectType;
      $scope.assetTypes = getTypes.data;

      if($scope.subjectType === 'driver') {
          // console.log("assignment modal called from driverProfile");
          $scope.subject = subject;
          $scope.updateSubj = dataService.updateDriver;
          $scope.subjIdentifier = "Name" || null;

          if($scope.objectType === 'car') {
              $scope.updateObj = dataService.updateCar;

              getCars().then(function(result) {
                  $scope.fullObjects = result.data;
                  $scope.objIdentifier = $scope.fullObjects[0].identifier;
                  $scope.simpleObjects = objectHelpers.simplify($scope.fullObjects);
              });
          } else if($scope.objectType === 'asset') {
              $scope.updateObj = dataService.updateAsset;
              getAssets().then(result => {
                  $scope.fullObjects = result.data;
                  // console.log($scope.fullObjects)
                  $scope.simpleObjects = objectHelpers.simplify($scope.fullObjects);
                  // console.log($scope.simpleObjects)
                  $scope.objIdentifiers = _.uniq(_.map($scope.fullObjects, function(asset) {
                      return asset.assetType;
                  }));
              });
          } else {
            console.log($scope.objectType)
          }
      } else if($scope.subjectType === 'car') {
          // console.log("assignment modal called from carProfile");
          $scope.subject = subject;
          $scope.updateSubj = dataService.updateCar;
          $scope.updateObj = dataService.updateDriver;
          $scope.subjIdentifier = $scope.subject.identifier;
          $scope.objIdentifier = "Name" || null;
          getDrivers().then(result => {
              $scope.fullObjects = result.data;
              $scope.simpleObjects = objectHelpers.simplify($scope.fullObjects);
          })
      } else if($scope.subjectType === 'asset') {
          console.log("assignment modal called from assetProfile");
          $scope.subject = asset;
          $scope.updateSubj = dataService.updateAsset;
          $scope.updateObj = dataService.updateDriver;
          $scope.subjIdentifier = $scope.subject.identifier;
          $scope.objIdentifier = "Name" || null;
          getDrivers().then(result => {
              $scope.fullObjects = result.data;
              // console.log($scope.fullObjects)
              $scope.simpleObjects = objectHelpers.simplify($scope.fullObjects);
              // console.log($scope.simpleObjects)
          })
      } else {
          console.log('assignment modal called from invalid state', $state.current);
      }

      $scope.validForm = function() {
          return (($scope.formData.objId === null) || (typeof $scope.formData.objId === "undefined"));
      };

      $scope.reset = function () {
        $scope.formData = {};
        $scope.form.$setPristine();
        $scope.form.$setUntouched();
        $state.forceReload();
      };

      $scope.close = function () {
          $state.forceReload();
          $uibModalInstance.close('ok');
      };

      $scope.getObjectIdentifierValue = function(id) {
          var deferred = $q.defer();
          var obj = _.find($scope.simpleObjects, function(obj) {
              return obj.id == id;
          });

          deferred.resolve(obj.identifierValue);
          deferred.reject('Failed to get identifier value');
          return deferred.promise;
      };

      $scope.assignSubjectToObject = function() {
          console.log($scope.subjIdentifier);
          console.log($scope.subject);
          var subject = {
              id: $scope.subject.id,
              identifier: {
                  name: $scope.subjIdentifier,
                  value: $scope.subject.data[$scope.subjIdentifier].value,
              },
              assetType: ($scope.subjectType === 'asset') ? $scope.subject.assetType : null,
              dateAssigned: $scope.datepicker.dt.getTime(),
              dateUnassigned: null
          };

          var obj = _.find($scope.fullObjects, function(object) {
              return object.id == $scope.formData.objId;
          });

          // setting the correct reciprocal update call
          if($scope.objectType === 'driver') {
              if($scope.subjectType === 'car') {
                  obj.carsAssigned.push(subject);
              } else if($scope.subjectType === 'asset') {
                  obj.assetsAssigned.push(subject);
              }
          } else if($scope.objectType === 'car') {
              obj.driversAssigned.push(subject);
          } else if($scope.objectType === 'asset') {
              obj.driversAssigned.push(subject);
          } else {
              console.log('Invalid assignment operation', {
                  subject: $scope.subjectType,
                  objects: $scope.objectType
              });
          }

          $scope.updateObj(obj);
      };

      // Assign object to subject
      $scope.submit = function() {

          $scope.getObjectIdentifierValue($scope.formData.objId).then(function(identifierValue) {
              var object = {
                  id: parseInt($scope.formData.objId),
                  identifier: {
                      name: $scope.objIdentifier,
                      value: identifierValue
                  },
                  assetType: ($scope.objectType === 'asset') ? $scope.assetType : null,
                  dateAssigned: $scope.datepicker.dt.getTime(),
                  dateUnassigned: null
              };

              if($scope.subjectType === 'driver') {
                  if($scope.objectType === 'car') {
                      $scope.subject.carsAssigned.push(object);
                  } else if($scope.objectType === 'asset') {
                      $scope.subject.assetsAssigned.push(object);
                  }

                  $scope.updateSubj($scope.subject);
              } else if($scope.subjectType === 'car') {
                  $scope.subject.driversAssigned.push(object);
                  $scope.updateSubj($scope.subject);
              } else if($scope.subjectType === 'asset') {
                  $scope.subject.driversAssigned.push(object);
                  $scope.updateSubj($scope.subject);
              } else {
                  console.log('Invalid assignment operation', {
                      subject: $scope.subjectType,
                      objects: $scope.objectType
                  });
              }

              $scope.assignSubjectToObject();
              $scope.close();
          });
      };
    }]);
})();
