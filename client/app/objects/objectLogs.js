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
    .controller('ObjectLogsCtrl', ['_', 'objectType', 'objectId', 'objectHelpers', 'carHelpers', 'driverHelpers', 'prospectHelpers', 'assetHelpers', '$state', '$scope',
      function (_, objectType, objectId, objectHelpers, carHelpers, driverHelpers, prospectHelpers, assetHelpers, $state, $scope) {

      var ctrl = this;
      $scope.identifierValue = null
      $scope.objectType = objectType;
      $scope.logDataObj = {};

      $scope.getObject = function () {
          if($scope.objectType === 'car') {
              $scope.update = carHelpers.update;
              return carHelpers.getById;
          } else if($scope.objectType === 'driver') {
              $scope.update = driverHelpers.update;
              return driverHelpers.getById;
          } else if($scope.objectType === 'prospect') {
              $scope.update = prospectHelpers.update;
              return prospectHelpers.getById;
          } else if($scope.objectType === 'asset') {
              $scope.update = assetHelpers.update;
              return assetHelpers.getById;
          }
      };

      $scope.getLogDates = function () {
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

      $scope.getObject()(objectId).then(function(result) {
          $scope.object = result.data;
          $scope.logs = $scope.object.logs
          $scope.identifierValue = objectHelpers.getIdentifierValue(result.data);
          $scope.assetType = $scope.object.assetType || null;
          $scope.tabs = [
              { title: 'Data', active: false, stateRef: objectHelpers.getStateRef($scope.objectType, $scope.object.id, 'Data') },
              { title: 'Logs', active: true, stateRef: objectHelpers.getStateRef($scope.objectType, $scope.object.id, 'Logs') }
          ];

          $scope.getLogDates()($scope.assetType).then(function(dates) {
              $scope.dates = dates;
              $scope.mostRecentLogDate = $scope.getMostRecentLogDate();
              ctrl.getFieldsToBeLogged($scope.object).then(function(fields) {
                  $scope.fields = fields;
                  $scope.logDataToArray();
              });
          });
      });

      $scope.getLogDataByDate = function (date) {
          // console.log(date);
          return $scope.logDataObj[date];
      };

      $scope.logDataToArray = function () {
          _.each($scope.dates, function(date) {
              var log = _.findWhere($scope.object.logs, { weekOf: date });
              var a = [];

              _.each($scope.fields, function(loggedField) {
                  // console.log(loggedField);
                  a.push({
                      field: loggedField,
                      value: log.data[loggedField],
                      type: $scope.object.data[loggedField].type
                  });
              });

              $scope.logDataObj[date] = a;
          });
      };

      $scope.getMostRecentLogDate = function() {
          // assuming sorted from recent to past
          return $scope.dates[0];
      };

      ctrl.getFieldsToBeLogged = function(object) {
          var fields = [];

          if (object) {
              for (var field in object.data) {
                  if(object.data[field].log) {
                    fields.push(field);
                  }
              }
          }

          return fields;
      };

      ctrl.updateMostRecentData = function() {
          var mostRecentLog = _.find($scope.object.logs, function(log) {
            return log.weekOf === $scope.mostRecentLogDate;
          });

          for(var field in mostRecentLog.data) {
              if(mostRecentLog.data[field] !== null && typeof mostRecentLog.data[field] !== 'undefined') {
                  $scope.object.data[field].value = mostRecentLog.data[field];
              }
          }

          return $scope.object;
      };

      // need to make this more efficient
      $scope.save = function(logDate) {
          // if(logDate === $scope.mostRecentLogDate) {
          //     // update object.data is new value isn't null
          //     // update data if most recent log was changed
          //     ctrl.updateMostRecentData().then(function(objectWithUpdatedData) {
          //         $scope.update(objectWithUpdatedData);
          //     });
          // }

          $scope.update($scope.object);
      };
    }]);
})();
