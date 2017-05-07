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
    .controller('ObjectLogsCtrl', ['_', 'objectType', 'objectId', 'objectHelpers', 'carHelpers', 'driverHelpers', 'prospectHelpers', 'assetHelpers', '$state',
      function (_, objectType, objectId, objectHelpers, carHelpers, driverHelpers, prospectHelpers, assetHelpers, $state) {

      var ctrl = this;
      ctrl.identifierValue = null
      ctrl.objectType = objectType;
      ctrl.logDataObj = {};
      ctrl.tabs = [];

      ctrl.getObject = function () {
          if(ctrl.objectType === 'car') {
              ctrl.update = carHelpers.update;
              return carHelpers.getById;
          } else if(ctrl.objectType === 'driver') {
              ctrl.update = driverHelpers.update;
              return driverHelpers.getById;
          } else if(ctrl.objectType === 'prospect') {
              ctrl.update = prospectHelpers.update;
              return prospectHelpers.getById;
          } else if(ctrl.objectType === 'asset') {
              ctrl.update = assetHelpers.update;
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
          if (result) {
            ctrl.object = result.data;
          }

          ctrl.logs = objectHelpers.convertArrayOfObjToArrayLikeObj(_.reverse(ctrl.object.logs))
          ctrl.identifierValue = objectHelpers.getIdentifierValue(result.data);
          ctrl.assetType = ctrl.object.assetType || null;
          ctrl.tabs = [
              { title: 'Data', stateRef: objectHelpers.getStateRef(ctrl.objectType, ctrl.object.id, 'Data') },
              { title: 'Logs', stateRef: objectHelpers.getStateRef(ctrl.objectType, ctrl.object.id, 'Logs') }
          ];

          ctrl.getLogDates()(ctrl.assetType).then(function(dates) {
              ctrl.dates = dates;
              ctrl.mostRecentLogDate = ctrl.getMostRecentLogDate();
              ctrl.fields = ctrl.getFieldsToBeLogged(ctrl.object);
              ctrl.logDataToArray();
          });
      });

      /**
       * Used to tabulate log data
       * */
      ctrl.getLogDataByDate = function(date) {
          return ctrl.logDataObj[date];
      };

      /**
       * Create object with log dates as keys and log data as values.
       * The object will be used by the template.
       * */
      ctrl.logDataToArray = function() {
        _.each(ctrl.dates, function(date) {
            var logData = [];
            var index = ctrl.dates.indexOf(date);
            var log = ctrl.object.logs[index];

            _.each(ctrl.fields, function(loggedField) {
                logData.push({
                    field: loggedField,
                    value: log.data[loggedField],
                    dataType: ctrl.object.data[loggedField].dataType
                });
            });

            ctrl.logDataObj[date] = logData;
        });
      };

      ctrl.getMostRecentLogDate = function() {
          // assuming sorted from recent to past
          return ctrl.dates[0];
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
          var mostRecentLog = _.find(ctrl.object.logs, function(log) {
            return log.weekOf === ctrl.mostRecentLogDate;
          });

          for(var field in mostRecentLog.data) {
              if(mostRecentLog.data[field] !== null && typeof mostRecentLog.data[field] !== 'undefined') {
                  ctrl.object.data[field].value = mostRecentLog.data[field];
              }
          }

          return ctrl.object;
      };

      ctrl.save = function() {
          // if(logDate === ctrl.mostRecentLogDate) {
          //     // update object.data is new value isn't null
          //     // update data if most recent log was changed
          //     ctrl.updateMostRecentData().then(function(objectWithUpdatedData) {
          //         ctrl.update(objectWithUpdatedData);
          //     });
          // }
          ctrl.update(ctrl.object);
      };
    }]);
})();
