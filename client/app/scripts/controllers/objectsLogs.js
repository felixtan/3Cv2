(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name clientApp.controller:CarstatuslogsCtrl
   * @description
   * # CarstatuslogsCtrl
   * Controller of the clientApp
   */
  angular.module('clientApp')
    .controller('ObjectsLogsCtrl', ['$uibModal', 'objectType', 'objectHelpers', 'datepicker', 'carHelpers', 'driverHelpers', 'prospectHelpers', 'assetHelpers', '$q', '$scope', '$state', '_', '$window',
      function ($uibModal, objectType, objectHelpers, datepicker, carHelpers, driverHelpers, prospectHelpers, assetHelpers, $q, $scope, $state, _, $window) {

      var ctrl = this;
      $scope.objectType = objectType;
      $scope.datepicker = datepicker;
      $scope.dummyNum = { value: null };

      // Helpers
      $scope.getIdentifierValue = objectHelpers.getIdentifierValue
      $scope.getStateRef = objectHelpers.getStateRef

      ctrl.getObjects = function () {
          if($scope.objectType === 'car') {
              $scope.title = 'Car';
              ctrl.update = carHelpers.update;
              return carHelpers.get;
          } else if($scope.objectType === 'driver') {
              $scope.title = 'Driver';
              ctrl.update = driverHelpers.update;
              return driverHelpers.get;
          } else if($scope.objectType === 'prospect') {
              $scope.title = 'Prospect';
              ctrl.update = prospectHelpers.update;
              return prospectHelpers.get;
          } else if($scope.objectType === 'asset') {
              // $scope.title = 'Asset';
              ctrl.update = assetHelpers.update;
              return assetHelpers.getTypes;
          }
      };

      ctrl.getLogDates = function () {
          if($scope.objectType === 'car') {
              return carHelpers.getLogDates;
          } else if($scope.objectType === 'driver') {
              return driverHelpers.getLogDates;
          } else if($scope.objectType === 'prospect') {
              return function () {};
          } else if($scope.objectType === 'asset') {
              return assetHelpers.getLogDates;
          }
      };

      ctrl.getAssetsOfTypeAndLogs = function (assetType) {
          assetHelpers.getByType(assetType).then(function(result) {
          });

          ctrl.getLogDates()(assetType).then(function(dates) {
              $scope.dates = dates;
              ctrl.getMostRecentLogDate();
          });
      };

      ctrl.getObjects()().then(function(result) {
          if ($scope.objectType !== 'asset') {

              $scope.objects = result.data;

              ctrl.getLogDates()().then(dates => {
                $scope.dates = dates
                ctrl.getMostRecentLogDate()
              })
          } else {
              $scope.assetTypes = result.data.types;
              $scope.assetType = $scope.assetTypes[0].value;
              $scope.tabs = [];

              _.each($scope.assetTypes, function(assetType, index) {
                  $scope.tabs.push({
                      title: assetType.value,
                      active: (index === 0),
                  });
              });

              ctrl.getAssetsOfTypeAndLogs($scope.assetType);
          }
      });



      $scope.renderLogs = function (assetType) {
          // console.log(assetType);
          $scope.assetType = assetType;
          $scope.title = assetType;
          ctrl.getAssetsOfTypeAndLogs($scope.assetType);
      };

      $scope.ifAssetIsOfType = function (object) {
          if ($scope.objectType === 'asset') {
              return object.assetType === $scope.assetType;
          } else {
              return true;
          }
      };

      ctrl.getMostRecentLogDate = function() {
          // return Math.max(...$scope.dates); -> assuming unsorted

          // assuming sorted from recent to past
          if($scope.dates.length > 0) {
              ctrl.mostRecentLogDate = $scope.dates[0];
          } else {
              ctrl.mostRecentLogDate = null;
          }
      };

      ctrl.getFieldsToBeLogged = function(object) {
          var deferred = $q.defer();
          var fields = [];
          for(var field in object.data) {
              if(object.data[field].log === true) { fields.push(field); }
          }

          deferred.resolve(fields);
          deferred.reject(new Error('Error getting fields to be logged'));
          return deferred.promise;
      };

      // returns an object to be object.logs[i].data with keys (feilds) to be logged
      ctrl.newDataObj = function() {
          var deferred = $q.defer(),
              data = {},
              objects = ($scope.objectType !== 'asset') ? $scope.objects : assetHelpers.filterAssetsByType($scope.objects, $scope.assetType);

          // console.log(objects);
          // first object is taken because fields in object.data are assumed to be uniform for all objects
          ctrl.getFieldsToBeLogged(objects[0]).then(function(fields) {
              _.each(fields, function(field) {
                  data[field] = null;
              });
          });

          deferred.resolve(data);
          deferred.reject(new Error('Error creating log.data'));
          return deferred.promise;
      };

      ctrl.createLogForObject = function(object, date, data) {
          var deferred = $q.defer();

          if (!_.contains($scope.dates, date)) {
              object.logs.push({
                  createdAt: (new Date()),
                  weekOf: date,
                  data: data
              });
          }

          deferred.resolve(object);
          deferred.reject(new Error('Error creating log for object ' + object.id));
          return deferred.promise;
      };

      $scope.newLog = function() {
          // 1. show date picker
          // 2. user picks date -> store in log.date
          // 3. start of week -> stored in log.weekStarting
          // 4. create for all objects
          // employ loading animation

          var d = $scope.datepicker.dt,
              weekOf = (new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)).getTime(),
              promise = ctrl.newDataObj().then(function(blankDataObj) {
                  // console.log(blankDataObj);
                  _.each($scope.objects, function(object) {
                      ctrl.createLogForObject(object, weekOf, blankDataObj).then(ctrl.update);
                  });
              });

          if(!(_.contains($scope.dates, weekOf))) {
              $q.all([promise]).then(function(values) {
                  ctrl.createNewRow(weekOf);
                  $state.forceReload();
              }).catch(function(err) {
                  console.error(err);
              });
          } else {
              // TODO: make this into a nice modal
              $window.alert('Log for ' + d.toDateString() + ' already exists!');
          }
      };

      $scope.notExpressionField = function (field, object) {
          var type, assets;

          if ($scope.objectType === 'asset') {
              if (object.assetType === $scope.assetType) {
                  // console.log($scope.assetType);
                  assets = assetHelpers.filterAssetsByType($scope.objects, $scope.assetType);
                  // console.log(assets);
                  // console.log(field);
                  type = assets[0].data[field].type;
                  // console.log(type);
                  return type !== "function" && type !== 'inequality';
              } else {
                  return false;
              }
          } else if ($scope.objectType !== 'asset') {
              type = $scope.objects[0].data[field].type;
              return type !== "function" && type !== 'inequality';
          }
      };

      // need to make this more efficient
      $scope.save = function(logDate) {
          // if($scope.invalidEntries.length === 0) {
              let mostRecentLog = null;
              _.each($scope.objects, function(object) {
                  if ($scope.objectType !== 'asset') {
                      if (logDate === ctrl.mostRecentLogDate) {
                          // update object.data is new value isn't null
                          mostRecentLog = _.find(object.logs, function(log) { return log.weekOf === ctrl.mostRecentLogDate; });
                          for(var field in mostRecentLog.data) {
                              if(mostRecentLog.data[field] !== null && typeof mostRecentLog.data[field] !== 'undefined') { object.data[field].value = mostRecentLog.data[field]; }
                          }
                      }
                  } else {
                      if ($scope.assetType === $scope.objectType) {
                          if (logDate === ctrl.mostRecentLogDate) {
                              // update object.data is new value isn't null
                              mostRecentLog = _.find(object.logs, function(log) { return log.weekOf === ctrl.mostRecentLogDate; });
                              for(var field in mostRecentLog.data) {
                                  if(mostRecentLog.data[field] !== null && typeof mostRecentLog.data[field] !== 'undefined') { object.data[field].value = mostRecentLog.data[field]; }
                              }
                          }
                      }
                  }

                  ctrl.update(object);
              });
          // }
      };

      $scope.getLog = function (date) {
          return _.find($scope.object.logs, function(log) {
              return log.weekOf === date;
          });
      };

      $scope.invalidEntries = [];
      $scope.validValue = true;
      $scope.validate = function (newValue, oldValue, fieldName, _log_, _object_) {
          // console.log(newValue);
          // console.log(oldValue);
          // console.log(fieldName);
          // console.log(_log_);
          // console.log(_object_);
          var objects = ($scope.objectType !== 'asset') ? $scope.objects : assetHelpers.filterAssetsByType($scope.objects, $scope.assetType),
              object = _.find(objects, function(object) { return object.id === _object_.id; }),
              fieldData = object.data[fieldName],
              log = _.find(object.logs, function(log) { return log.weekOf === _log_.weekOf; }),
              logData = log.data[fieldName];
          if (fieldData.type === 'number') {
              logData = isNaN(newValue) ? oldValue : newValue;
              $scope.validValue = isNaN(newValue);

              // $scope.validValue = !

              // if (isNaN(newValue)) {

              // } else {
              //     $scope.invalid_.find
              // }
              // $scope.invalidEntries.push({
              //     identifierValue: object.data[object.identifier].value,
              //     fieldName: fieldName,
              //     logDate: log.weekOf,
              // });
          } else {
              $scope.validValue = true;
          }
      };

      ctrl.createNewRow = function(date) {
          // add new date to array of log dates
          if (!_.contains($scope.dates, date)) { $scope.dates.push(date); }
      };

      $scope.open = function (size, thing) {
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'views/deletefieldmodal.html',
              controller: 'DeleteFieldModalInstanceCtrl',
              size: size,
              resolve: {
                  thing: function() {
                      return thing;   // object { type: x, value: y } such that x ∈ ['field', 'log'] and y ∈ $scope.fields or $scope.dates
                  },
                  getCars: function () {
                      return ($scope.objectType === 'car') ? $scope.objects : {};
                  },
                  getDrivers: function () {
                      return ($scope.objectType === 'driver') ? $scope.objects : {};
                  },
                  getProspects: function() {
                      return ($scope.objectType === 'prospect') ? $scope.objects : {};
                  },
                  getAssets: function () {
                      return ($scope.objectType === 'asset') ? assetHelpers.filterAssetsByType($scope.objects, $scope.assetType) : {};
                  },
                  objectType: function () {
                      return $scope.objectType;
                  },
              }
          });

          modalInstance.result.then(function (input) {
              $scope.input = input;
              console.log('passed back from DeleteFieldModalInstanceCtrl:', input);
          }, function () {
              console.log('Modal dismissed at: ' + new Date());
          });
      };
    }]);
})();
