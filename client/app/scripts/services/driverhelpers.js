'use strict';

/**
 * @ngdoc service
 * @name clientApp.driverHelpers
 * @description
 * # driverHelpers
 * Service in the clientApp.
 */
angular.module('clientApp')
  .factory('driverHelpers', function ($q, dataService) {

      var getDrivers = dataService.getDrivers;
  
      var getLogDates = function(existingDrivers) {
        return $q(function(resolve, reject) {
          var logDates = [];
          var drivers = null;
          if(existingDrivers.constructor === Object) {
            drivers = existingDrivers.data;   // should be from dataService
          } else if(existingDrivers.constructor === Array) {
            drivers = existingDrivers; 
          } else {
            // idk wtf it is
            reject(new Error('Invalid existingDrivers data type:', existingDrivers));
          }

          if(drivers.length > 0) {
            _.each(drivers, function(driver) {
              _.each(driver.logs, function(log) {
                logDates.push(log.weekOf);
                logDates = _.uniq(logDates.sort(), true).reverse();
              });
            });
          }

          resolve(logDates);
          reject(new Error('Error getting log dates'));
        });
      };

      var createLog = function(data, weekOf) {
        return $q(function(resolve, reject) {
          var log = {};
          log.data = data;
          log.createdAt = (new Date());
          log.weekOf = weekOf;

          resolve(log);
          reject(new Error('Error creating blank log object'));
        });
      };

      var createLogs = function(logData, logDates) {
        return $q(function(resolve, reject) {
          var logs = [];

          _.each(logDates, function(logDate) {
            createLog(logData, logDate).then(function(log) {
              logs.push(log);
            });
          });

          resolve(logs);
          reject(new Error("Error creating blank logs array"));
        });
      };

      var getFieldsToBeLogged = function(driver) {
        return $q(function(resolve, reject) {
          var fields = [];

          for (var field in driver.data) {
            if (driver.data[field].log === true) {
              fields.push(field);
            }
          }

          resolve(fields);
          reject(new Error('Error getting fields to be logged'));
        });
      };

      var createLogData = function(fields) {
        return $q(function(resolve, reject) {
          var logData = {};

          if (fields.length > 0) {
            fields.forEach(function(field) {
                logData[field] = null;
            });
          }

          resolve(logData);
          reject(new Error('Error creating log.data'));
        });
      };

      // Public API here
      return {

        // returns array of log dates in ms in present to past order
        // logDates[0] stores most recent log date
        getLogDates: function(drivers) {
          return getLogDates(drivers);
        },

        getFieldsToBeLogged: getFieldsToBeLogged,

        // relies on getFieldsToBeLogged
        createLogData: function(fields) {
          return createLogData(fields);
        },

        // relies on createLogData and calcLogDates
        createLog: function(data, weekOf) {
          return createLog(data, weekOf);
        },

        populateLogs: function(driver) {
          // promise groups
          // 1. getFieldsToBeLogged -> createLogData
          // 2. getDrivers -> getLogDates
          // 3. 1,2 -> createLogs (_.each combine with createLog)

          var deferred = $q.defer();
          var errcb = function(err) { console.error(err) };
          var promise1 = getFieldsToBeLogged(driver).then(createLogData, errcb);
          var promise2 = getDrivers().then(getLogDates, errcb);

          $q.all([promise1, promise2]).then(function(values) {
            createLogs(values[0], values[1]).then(function(logs) {
              driver.logs = logs;
              deferred.resolve(driver);
              deferred.reject(new Error('Failed to populate logs for driver ' + driver.id));
            }, errcb);
          }, errcb);

          return deferred.promise;
        } // closes populateLogs
    }; // close return
});
