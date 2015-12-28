'use strict';

/**
 * @ngdoc service
 * @name clientApp.carHelpers
 * @description
 * # carHelpers
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('carHelpers', function ($q, dataService) {
  
  var getCars = dataService.getCars;
  
  var getLogDates = function(existingCars) {
    return $q(function(resolve, reject) {
      var logDates = [];
      var cars = null;
      if(existingCars.constructor === Object) {
        cars = existingCars.data;   // should be from dataService
      } else if(existingCars.constructor === Array) {
        cars = existingCars; 
      } else {
        // idk wtf it is
        reject(new Error('Invalid existingCars data type:', existingCars));
      }

      if(cars.length > 0) {
        _.each(cars, function(car) {
          _.each(car.logs, function(log) {
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

  var getFieldsToBeLogged = function(car) {
    return $q(function(resolve, reject) {
      var fields = [];

      for (var field in car.data) {
        if (car.data[field].log === true) {
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
    getLogDates: function(cars) {
      return getLogDates(cars);
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

    populateLogs: function(car) {
      // promise groups
      // 1. getFieldsToBeLogged -> createLogData
      // 2. getCars -> getLogDates
      // 3. 1,2 -> createLogs (_.each combine with createLog)

      var deferred = $q.defer();
      var errcb = function(err) { console.error(err) };
      var promise1 = getFieldsToBeLogged(car).then(createLogData, errcb);
      var promise2 = getCars().then(getLogDates, errcb);

      $q.all([promise1, promise2]).then(function(values) {
        createLogs(values[0], values[1]).then(function(logs) {
          car.logs = logs;
          deferred.resolve(car);
          deferred.reject(new Error('Failed to populate logs for car ' + car.id));
        }, errcb);
      }, errcb);

      return deferred.promise;
    } // closes populateLogs
  }; // close return
});