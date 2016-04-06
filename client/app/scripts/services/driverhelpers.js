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

    var get = dataService.getDrivers;
    var getById = dataService.getDriver;
    var saveDriver = dataService.createDriver;
    var update = dataService.updateDriver;

    var getOrganizationId = function() {
      return (ENV.name === ('production' || 'staging')) ? $scope.user.customData.organizationId : '3Qnv2pMAxLZqVdp7n8RZ0x';
    };

    var getFullName = function(driverData) {
      return driverData["First Name"].value + " " + driverData["Last Name"].value;
    };

    var thereAreDrivers = function() {
      var deferred = $q.defer();
      get().then(function(result) {
        deferred.resolve((typeof result.data[0] !== 'undefined'));
        deferred.reject(new Error('Error determining if there are drivers.'));
      });
      return deferred.promise;
    };

    var getFields = function() {
      var deferred = $q.defer();
      get().then(function(result) {
        deferred.resolve(Object.keys(result.data[0].data));
        deferred.reject(new Error('Failed to get fields'));
      });
      return deferred.promise;
    };

    var notName = function(field) {
      return ((field != "First Name") && (field != "Last Name") && (field != "Name"));
    };

    var namesNotNull = function(driverData) {
      return ((driverData["First Name"].value !== null) && (driverData["Last Name"].value !== null));
    };

    var updateFullName = function(driverData) {
      var deferred = $q.defer();

      driverData["Name"] = {
        value: getFullName(driverData),
        log: false,
        dataType: 'text',
        type: 'text'
      };

      deferred.resolve(driverData);
      deferred.reject(new Error('Failed to inject full name'));
      return deferred.promise;
    };

    var createDriver = function(driverData, identifier) {
      var deferred = $q.defer();
      if(driverData.assetType) delete driverData.assetType;
      updateFullName(driverData).then(function(driverDataWithFullName) {
        // console.log(driverDataWithFullName);
        createLogData().then(function(logData) {
          // console.log(logData);
          getLogDates().then(function(logDates) {
            // console.log(logDates);
            createLogs(logDates, logData).then(function(logs) {
              // console.log(logs);
              
              deferred.resolve({
                identifier: "Name",
                data: driverDataWithFullName,
                logs: logs,
                carsAssigned: [],
                assetsAssigned: [],
                organizationId: getOrganizationId()
              });

              deferred.reject(new Error('Error creating driver'));
            });
          });
        });
      });

      return deferred.promise;
    };

    var getDefaultDriver = function() {
      return {
        identifier: "Name",
        data: {
          "First Name": {
            value: null,
            log: false,
            dataType: 'text',
            type: 'text'
          },
          "Last Name": {
            value: null,
            log: false,
            dataType: 'text',
            type: 'text'
          },
          "Name": {
            value: null,
            log: false,
            dataType: 'text',
            type: 'text'
          }
        },
        logs: [],
        carsAssigned: [],
        assetsAssigned: [],
        organizationId: getOrganizationId()
      };
    };

    var getFormDataAndRepresentative = function() {
      var deferred = $q.defer();
      var formData = {};

      thereAreDrivers().then(function(ans) {
        if(ans) {
          // console.log('there are drivers');
          get().then(function(result) {
            var driverData = result.data[0].data;
            // console.log(driver);
            _.each(Object.keys(driverData), function(field) {
              formData[field] = {
                value: null,
                log: driverData[field].log,
                dataType: driverData[field].dataType,
                type: driverData[field].type
              }
            });

            console.log('there are cars, driver data:', formData);
            deferred.resolve({
              formData: formData,
              representativeData: driverData
            });
            deferred.reject(new Error('Error initializing driver form data'));
          });
        } else {
          var defaultDriver = getDefaultDriver();
          deferred.resolve({
            formData: defaultDriver.data,
            representativeData: defaultDriver
          });
          // console.log('there are no drivers, default driver data:', defaultDriverData);
          deferred.reject(new Error('Error initializing driver form data'));
        }
      });

      return deferred.promise;
    };

    /////////////////
    /// Logs CRUD ///
    /////////////////

    var getLogDates = function() {
      var deferred = $q.defer();
      var logDates = [];

      // if(existingDrivers.constructor === Object) {
      //   drivers = existingDrivers.data;   // should be from dataService
      // } else if(existingDrivers.constructor === Array) {
      //   drivers = existingDrivers; 
      // } else {
      //   // idk wtf it is
      //   reject(new Error('Invalid existingDrivers data type:', existingDrivers));
      // }

      get().then(function(result) {
        var drivers = result.data;
        if(drivers.length > 0) {
          _.each(drivers, function(driver) {
            _.each(driver.logs, function(log) {
              logDates.push(log.weekOf);
              logDates = _.uniq(logDates.sort(), true).reverse();
            });
          });
        }

        deferred.resolve(logDates);
        deferred.reject(new Error('Error getting log dates'));
      });

      return deferred.promise;
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

    var createLogs = function(logDates, blankLogData) {
      var deferred = $q.defer();
      var logs = [];

      _.each(logDates, function(logDate) {
        logs.push({
          data: blankLogData,
          weekOf: logDate,
          createdAt: new Date()
        });
      });

      deferred.resolve(logs);
      deferred.reject(new Error("Error creating blank logs array"));
      return deferred.promise;
    };

    var getFieldsToBeLogged = function() {
      var deferred = $q.defer();
      var fields = [];

      get().then(function(result) {
        var drivers = result.data
        if(drivers.length > 0) {
          fields = _.filter(Object.keys(drivers[0].data), function(field) {
            return drivers[0].data[field].log;
          });
        }

        deferred.resolve(fields);
        deferred.reject(new Error('Error getting fields to be logged'));
      });

      return deferred.promise;
    };

    var createLogData = function() {
      var deferred = $q.defer();
      var logData = {};

      getFieldsToBeLogged().then(function(fields) {
        // console.log(fields);
        _.each(fields, function(field) {
          logData[field] = null;
        });

        deferred.resolve(logData);
        deferred.reject(new Error('Error creating log data'));
      });

      return deferred.promise;
    };

    var populateLogs = function(driver) {
      // promise groups
      // 1. getFieldsToBeLogged -> createLogData
      // 2. getDrivers -> getLogDates
      // 3. 1,2 -> createLogs (_.each combine with createLog)

      var deferred = $q.defer();
      var errcb = function(err) { console.error(err) };
      var promise1 = getFieldsToBeLogged(driver).then(createLogData, errcb);
      var promise2 = get().then(getLogDates, errcb);

      $q.all([promise1, promise2]).then(function(values) {
        createLogs(values[1], values[0]).then(function(logs) {
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
      get: get,
      getById: getById,
      saveDriver: saveDriver,
      update: update,
      createDriver: createDriver,
      thereAreDrivers: thereAreDrivers,
      getFields: getFields,
      notName: notName,
      namesNotNull: namesNotNull,
      getFullName: getFullName,
      updateFullName: updateFullName,
      getDefaultDriver: getDefaultDriver,
      getFormDataAndRepresentative: getFormDataAndRepresentative,

      // Logs
      getLogDates: getLogDates,                   // returns array of log dates in ms in present to past order; logDates[0] stores most recent log date
      getFieldsToBeLogged: getFieldsToBeLogged,
      createLogData: createLogData,               // relies on getFieldsToBeLogged
      createLog: createLog,                       // relies on createLogData and calcLogDates
      createLogs: createLogs,
      populateLogs: populateLogs

    };
});