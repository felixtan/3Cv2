(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name clientApp.controller:CarlogCtrl
   * @description
   * # CarlogCtrl
   * Controller of the clientApp
   */
  angular.module('clientApp')
    .controller('ObjectLogsCtrl', ['_', 'objectType', 'objectId', 'carHelpers', 'driverHelpers', 'prospectHelpers', 'assetHelpers', '$state', '$q', '$state',
      function (_, objectType, objectId, carHelpers, driverHelpers, prospectHelpers, assetHelpers, $state, $q, $scope) {

      var ctrl = this;
      ctrl.objectType = objectType;
      ctrl.logDataObj = {};

      ctrl.getObject = function () {
          if(ctrl.objectType === 'car') {
              ctrl.update = carHelpers.update;
              $scope.state = {
                  data: 'carData({ id: object.id })',
                  logs: 'carLogs({ id: object.id })',
              };
              return carHelpers.getById;
          } else if(ctrl.objectType === 'driver') {
              ctrl.update = driverHelpers.update;
              $scope.state = {
                  data: 'driverData({ id: object.id })',
                  logs: 'driverLogs({ id: object.id })',
              };
              return driverHelpers.getById;
          } else if(ctrl.objectType === 'prospect') {
              ctrl.update = prospectHelpers.update;
              $scope.state = {
                  data: 'prospectData({ id: object.id })',
                  logs: null,
              };
              return prospectHelpers.getById;
          } else if(ctrl.objectType === 'asset') {
              ctrl.update = assetHelpers.update;
              $scope.state = {
                  data: 'assetData({ id: object.id })',
                  logs: 'assetLogs({ id: object.id })',
              };
              return assetHelpers.getById;
          }
      };

      ctrl.getLogDates = function () {
          if(ctrl.objectType === 'car') {
              return carHelpers.getLogDates;
          } else if(ctrl.objectType === 'driver') {
              return driverHelpers.getLogDates;
          } else if(ctrl.objectType === 'prospect') {
              return function () {};
          } else if(ctrl.objectType === 'asset') {
              return assetHelpers.getLogDates;
          }
      };

      ctrl.getObject()(objectId).then(function(result) {
          $scope.object = result.data;
          $scope.identifierValue = $scope.object.data[$scope.object.identifier].value;
          $scope.assetType = $scope.object.assetType || null;
          $scope.tabs = [
              { title: 'Data', active: false, state: $scope.state.data },
              { title: 'Logs', active: true, state: $scope.state.logs }
          ];

          ctrl.getLogDates()($scope.assetType).then(function(dates) {
              ctrl.dates = dates;
              ctrl.mostRecentLogDate = ctrl.getMostRecentLogDate();
              ctrl.getFieldsToBeLogged($scope.object).then(function(fields) {
                  $scope.fields = fields;
                  ctrl.logDataToArray();
              });
          });
      });

      $scope.getLogDataByDate = function (date) {
          // console.log(date);
          return ctrl.logDataObj[date];
      };

      $scope.notExpressionField = function (type) {
          // console.log(type);
          // console.log(type !== "function" && type !== 'inequality');
          return type !== "function" && type !== 'inequality';
      };

      ctrl.logDataToArray = function () {
          _.each(ctrl.dates, function(date) {
              // console.log(date);
              var log = _.findWhere($scope.object.logs, { weekOf: date });
              // console.log(log);
              var a = [];

              _.each($scope.fields, function(loggedField) {
                  // console.log(loggedField);
                  a.push({
                      field: loggedField,
                      value: log.data[loggedField],
                      type: $scope.object.data[loggedField].type
                  });
              });
              // console.log(a);
              // console.log(ctrl.logDataObj);
              ctrl.logDataObj[date] = a;
              // console.log(ctrl.logDataObj);
          });

          // deferred.resolve(b);
          // deferred.reject(new Error("Error converting log data to array"));
          // return deferred.promise;
      };

      ctrl.getMostRecentLogDate = function() {
          // assuming sorted from recent to past
          return ctrl.dates[0];
      };

      ctrl.getFieldsToBeLogged = function(object) {
          var deffered = $q.defer();
          var fields = [];

          if(object) {
              for(var field in object.data) {
                  if(object.data[field].log === true) { fields.push(field); }
              }
          }

          deffered.resolve(fields);
          deffered.reject(new Error('Error getting fields to be logged'));

          return deffered.promise;
      };

      ctrl.updateMostRecentData = function() {
          var deferred = $q.defer();
          var mostRecentLog = _.find($scope.object.logs, function(log) { return log.weekOf === ctrl.mostRecentLogDate; });

          for(var field in mostRecentLog.data) {
              if(mostRecentLog.data[field] !== null && typeof mostRecentLog.data[field] !== 'undefined') {
                  $scope.object.data[field].value = mostRecentLog.data[field];
              }
          }

          deferred.resolve($scope.object);
          deferred.reject(new Error('Errror updating most recent log'));
          return deferred.promise;
      };

      // need to make this more efficient
      $scope.save = function(logDate) {
          if(logDate === ctrl.mostRecentLogDate) {
              console.log('most recent updated');
              // update object.data is new value isn't null
              // update data if most recent log was changed
              ctrl.updateMostRecentData().then(function(objectWithUpdatedData) {
                  ctrl.update(objectWithUpdatedData);
              });
          }

          ctrl.update($scope.object);
      };
    }]);
})();
