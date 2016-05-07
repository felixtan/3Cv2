'use strict';

/**
 * @ngdoc service
 * @name clientApp.driverHelpers
 * @description
 * # driverHelpers
 * Service in the clientApp.
 */
angular.module('clientApp')
  .factory('driverHelpers', function ($rootScope, $q, dataService, ENV, $window) {

    var _ = $window._;

    //////////////////////////
    //  Data CRUD and Forms //
    //////////////////////////

    var get = dataService.getDrivers;
    var getById = dataService.getDriver;
    var saveDriver = dataService.createDriver;
    var update = dataService.updateDriver;

    function getOrganizationId () {
      return (ENV.name === 'production' || ENV.name === 'staging') ? $rootScope.user.customData.organizationId : '3Qnv2pMAxLZqVdp7n8RZ0x';
    }

    function getFullName (driverData) {
      return driverData["First Name"].value + " " + driverData["Last Name"].value;
    }

    function notName (field) {
      return ((field !== "First Name") && (field !== "Last Name") && (field !== "Name"));
    }

    function namesNotNull (driverData) {
      console.log(driverData);
      return ((driverData["First Name"].value !== null) && (driverData["Last Name"].value !== null));
    }

    function updateFullName (driverData) {
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
    }

    function createDriver (driverData, identifier) {
      var deferred = $q.defer();
      
      if(driverData.assetType) {
        delete driverData.assetType;
      }

      updateFullName(driverData).then(function() {
        // console.log(driverDataWithFullName);
        createLogData().then(function(logData) {
          // console.log(logData);
          getLogDates().then(function(logDates) {
            // console.log(logDates);
            createLogs(logDates, logData).then(function(logs) {
              // console.log(logs);
              // console.log(driverData);

              deferred.resolve({
                identifier: "Name",
                data: driverData,
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
    }

    function getDefaultDriver () {
      var deferred = $q.defer();

      deferred.resolve({
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
          organizationId: getOrganizationId(),
      });
      deferred.reject(new Error("Error getting default driver."));
      return deferred.promise;
    }

    /////////////////
    /// Logs CRUD ///
    /////////////////

    function getLogDates () {
      var deferred = $q.defer();
      var logDates = [];

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
    }

    function createLogs (logDates, blankLogData) {
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
    }

    function getFieldsToBeLogged () {
      var deferred = $q.defer();
      var fields = [];

      get().then(function(result) {
        var drivers = result.data;
        if(drivers.length > 0) {
          fields = _.filter(Object.keys(drivers[0].data), function(field) {
            return drivers[0].data[field].log;
          });
        }

        deferred.resolve(fields);
        deferred.reject(new Error('Error getting fields to be logged'));
      });

      return deferred.promise;
    }

    function createLogData () {
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
    }

    return {

      // Data
      getOrganizationId: getOrganizationId,
      get: get,
      getById: getById,
      saveDriver: saveDriver,
      update: update,
      createDriver: createDriver,
      notName: notName,
      namesNotNull: namesNotNull,
      getFullName: getFullName,
      updateFullName: updateFullName,
      getDefaultDriver: getDefaultDriver,

      // Logs
      getLogDates: getLogDates,                   // returns array of log dates in ms in present to past order; logDates[0] stores most recent log date
      getFieldsToBeLogged: getFieldsToBeLogged,
      createLogData: createLogData,               // relies on getFieldsToBeLogged
      createLogs: createLogs,
    };
});