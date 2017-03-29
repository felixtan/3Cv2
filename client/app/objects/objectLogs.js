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
      $scope.tabs = [];

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
              $scope.fields = ctrl.getFieldsToBeLogged($scope.object);
              ctrl.logDataToArray();
          });
      });

      /**
       * Used by view to tabulate log data
       * */
      $scope.getLogDataByDate = function(date) {
          return $scope.logDataObj[date];
      };

      /**
       * Create object with log dates as keys and log data as values.
       * The object will be used by the template.
       * */
      ctrl.logDataToArray = function() {
        _.each($scope.dates, function(date) {
            var logData = [];
            var datesInChronologicalOrder = $scope.dates.reverse();
            var index = datesInChronologicalOrder.indexOf(date);
            var log = $scope.object.logs[index];

            _.each($scope.fields, function(loggedField) {
                logData.push({
                    field: loggedField,
                    value: log.data[loggedField],
                    type: $scope.object.data[loggedField].type
                });
            });

            $scope.logDataObj[date] = logData;
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
