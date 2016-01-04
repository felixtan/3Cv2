'use strict';

/**
 * @ngdoc service
 * @name clientApp.driverHelpers
 * @description
 * # driverHelpers
 * Service in the clientApp.
 */
angular.module('clientApp')
  .factory('driverHelpers', function ($q, dataService, ENV) {

    //////////////////////////
    //  Data CRUD and Forms //
    //////////////////////////

    var getDrivers = dataService.getDrivers;
    var saveDriver = dataService.createDriver;
    var updateDriver = dataService.updateDriver;

    var getOrganizationId = function() {
      return (ENV.name === ('production' || 'staging')) ? $scope.user.customData.organizationId : '3Qnv2pMAxLZqVdp7n8RZ0x';
    };

    var getFullName = function(driverData) {
      return driverData["First Name"].value + " " + driverData["Last Name"].value;
    };

    var thereAreDrivers = function() {
      var deferred = $q.defer();
      getDrivers().then(function(result) {
        deferred.resolve((typeof result.data[0] !== 'undefined'));
        deferred.reject(new Error('Error determining if there are drivers.'));
      });
      return deferred.promise;
    };

    var getFields = function() {
      var deferred = $q.defer();
      getDrivers().then(function(result) {
        deferred.resolve(Object.keys(result.data[0].data));
        deferred.reject(new Error('Failed to get fields'));
      });
      return deferred.promise;
    };

    var notName = function(field) {
      return ((field != "First Name") && (field != "Last Name") && (field != "fullName"));
    };

    var namesNotNull = function(driverData) {
      return ((driverData["First Name"].value !== null) && (driverData["Last Name"].value !== null));
    };

    var updateFullName = function(driverData) {
      var deferred = $q.defer();

      driverData.fullName = {
        value: getFullName(driverData),
        log: false
      };

      deferred.resolve(driverData);
      deferred.reject(new Error('Failed to inject full name'));
      return deferred.promise;
    };

    var createDriver = function(driverData) {
      var deferred = $q.defer();
      updateFullName(driverData).then(function(driverDataWithFullName) {
        deferred.resolve({
          identifier: "fullName",
          data: driverDataWithFullName,
          logs: [],
          carsAssigned: [],
          organizationId: getOrganizationId()
        });
        
        deferred.reject(new Error('Error creating driver'));
      });

      return deferred.promise;
    };

    var getDefaultDriver = function() {
      return {
        identifier: "fullName",
        data: {
          "First Name": {
            value: null,
            log: false
          },
          "Last Name": {
            value: null,
            log: false
          },
          fullName: {
            value: null,
            log: false
          }
        },
        logs: [],
        carsAssigned: [],
        organizationId: getOrganizationId()
      };
    };

    var getFormData = function() {
      var deferred = $q.defer();
      var formData = {};

      if(thereAreDrivers()) {
        // console.log('there are drivers');
        getDrivers().then(function(result) {
          var driverData = result.data[0].data;
          // console.log(driver);
          _.each(Object.keys(driverData), function(field) {
            formData[field] = {
              value: null,
              log: driverData[field].log
            }
          });
          deferred.resolve(formData);
          deferred.reject(new Error('Error initializing driver form data'));
        });
      } else {
        console.log('there are no drivers');
        deferred.resolve(getDefaultDriver().data);
        deferred.reject(new Error('Error initializing driver form data'));
      }

      return deferred.promise;
    };

    /////////////////
    /// Logs CRUD ///
    /////////////////

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
          if (driver.data[field].log) {
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

    var populateLogs = function(driver) {
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
    };

    return {

      // Data
      getOrganizationId: getOrganizationId,
      getDrivers: getDrivers,
      saveDriver: saveDriver,
      updateDriver: updateDriver,
      createDriver: createDriver,
      thereAreDrivers: thereAreDrivers,
      getFields: getFields,
      notName: notName,
      namesNotNull: namesNotNull,
      getFullName: getFullName,
      updateFullName: updateFullName,
      getDefaultDriver: getDefaultDriver,
      getFormData: getFormData,

      // Logs
      getLogDates: getLogDates,                   // returns array of log dates in ms in present to past order; logDates[0] stores most recent log date
      getFieldsToBeLogged: getFieldsToBeLogged,
      createLogData: createLogData,               // relies on getFieldsToBeLogged
      createLog: createLog,                       // relies on createLogData and calcLogDates
      createLogs: createLogs,
      populateLogs: populateLogs

    };
});