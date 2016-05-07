'use strict';

/**
 * @ngdoc service
 * @name clientApp.carHelpers
 * @description
 * # carHelpers
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('carHelpers', function ($rootScope, $window, ENV, $q, dataService) {
  
    var _ = $window._;

  //////////////////////////
  //  Data CRUD and Forms //
  //////////////////////////

  var get = dataService.getCars;
  var getById = dataService.getCar;
  var saveCar = dataService.createCar;
  var update = dataService.updateCar;

  function getOrganizationId () {
    return (ENV.name === 'production' || ENV.name === 'staging') ? $rootScope.user.customData.organizationId : '3Qnv2pMAxLZqVdp7n8RZ0x';
  }

  function getIdentifier () {
    var deferred = $q.defer();

    get().then(function(result) {
      if(typeof result.data !== "undefined" && result.data.length > 0) {
        var driver = result.data[0];
        deferred.resolve(driver.identifier);
        deferred.reject(new Error("Error getting identifier."));
      } else {
        deferred.resolve(null);
        deferred.reject(new Error("Error getting identifier."));
      }
    });
      
    return deferred.promise;
  }

  function createCar (carData, identifier) {
    var deferred = $q.defer();
    
    if(carData.assetType) {
      delete carData.assetType;
    }

    createLogData().then(function(logData) {
      // console.log(logData);
      getLogDates().then(function(logDates) {
        // console.log(logDates);
        createLogs(logDates, logData).then(function(logs) {
          // console.log(logs);

          deferred.resolve({
            identifier: identifier,
            data: carData,
            logs: logs,
            driversAssigned: [],
            organizationId: getOrganizationId()
          });
          
          deferred.reject(new Error('Error creating car'));
        });
      });
    });

    return deferred.promise;
  }

  function getDefaultCar () {
    var deferred = $q.defer();

    deferred.resolve({
        identifier: null,
        data: {},
        logs: [],
        driversAssigned: [],
        organizationId: getOrganizationId()
    });
    deferred.reject(new Error("Error getting default car."));
    return deferred.promise;
  }

  /////////////////
  /// Logs CRUD ///
  /////////////////

  function getLogDates () {
    var deferred = $q.defer();
    var logDates = [];

    get().then(function(result) {
      var cars = result.data;
    
      // TODO: Do we have to do a double each here? If we can ensure that all 
      // car logs have the same dates, then we can just take the first car cars[0]
      _.each(cars, function(car) {
        _.each(car.logs, function(log) {
          logDates.push(log.weekOf);
          // logDates = _.uniq(logDates.sort(), true).reverse();
        });
      });

      deferred.resolve(_.uniq(logDates.sort(), true).reverse());
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
    deferred.reject(new Error("Error creating logs"));
    return deferred.promise;
  }

  function getFieldsToBeLogged () {
    var deferred = $q.defer();
    var fields = [];

    get().then(function(result) {
      var cars = result.data;
      if(cars.length > 0) {
        fields = _.filter(Object.keys(cars[0].data), function(field) {
          return cars[0].data[field].log;
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
      _.each(fields, function(field) {
        logData[field] = null;
      });

      deferred.resolve(logData);
      deferred.reject(new Error('Error creating log data'));
    });

    return deferred.promise;
  }

  // Public API here
  return {

    // Data
    get: get,
    getById: getById,
    update: update,
    saveCar: saveCar,
    createCar: createCar,
    getDefaultCar: getDefaultCar,
    getIdentifier: getIdentifier,
    getOrganizationId: getOrganizationId,
    
    // Logs
    getLogDates: getLogDates,
    getFieldsToBeLogged: getFieldsToBeLogged,
    createLogData: createLogData,
    createLogs: createLogs,
  }; 
});