(function() {
  'use strict';

  /**
   * @ngdoc service
   * @name clientApp.carHelpers
   * @description
   * # carHelpers
   * Factory in the clientApp.
   */
  angular.module('clientApp')
    .factory('carHelpers', ['$rootScope', '$q', '$state', 'dataService', '_', 'ENV', function ($rootScope, $q, $state, dataService, _, ENV) {

    //////////////////////////
    //  Data CRUD and Forms //
    //////////////////////////

    var get = dataService.getCars;
    var getById = dataService.getCar;
    var saveCar = dataService.createCar;
    var update = dataService.updateCar;

    // Public API here
    return {

      // Data
      get: get,
      getById: getById,
      update: update,
      saveCar: saveCar,
      createCar: createCar,
      thereAreCars: thereAreCars,
      getDefaultCar: getDefaultCar,
      getFields: getFields,
      simplify: simplify,
      updateIdentifier: updateIdentifier,
      _updateIdentifier: _updateIdentifier,
      getIdentifier: getIdentifier,
      getOrganizationId: getOrganizationId,
      getFormDataAndRepresentative: getFormDataAndRepresentative,

      // Logs
      getLogDates: getLogDates,
      getFieldsToBeLogged: getFieldsToBeLogged,
      createLogData: createLogData,
      createLog: createLog,
      populateLogs: populateLogs

    };

    function getOrganizationId() {
      return (ENV.name === ('production' || 'staging')) ? $rootScope.user.customData.organizationId : ENV.stormpathConfig.organizationId;
    }

    function thereAreCars() {
      var deferred = $q.defer();
      get().then(function(result) {
        deferred.resolve((typeof result.data[0] !== 'undefined'));
        deferred.reject(new Error('Error determining if there are cars.'));
      });
      return deferred.promise;
    }

    function getFields() {
      var deferred = $q.defer();
      get().then(function(result) {
        deferred.resolve(Object.keys(result.data[0].data));
        deferred.reject(new Error('Failed to get fields'));
      });
      return deferred.promise;
    }

    function getIdentifier() {
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

    function createCar(carData, identifier, assetType) {
      var deferred = $q.defer();
      if(carData.assetType) { delete carData.assetType; }

      createLogData().then(function(logData) {
        // console.log(logData);
        getLogDates().then(function(logDates) {
          // console.log(logDates);
          var logs = createLogs(logDates, logData);
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

      return deferred.promise;
    }

    /**
     * This is promisified because of how objectHelpers calls getDefaultObject
     * in getFormDataAndReference.
     * */
    function getDefaultCar() {
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

    function getFormDataAndRepresentative() {
      var deferred = $q.defer();
      var formData = {};

      thereAreCars().then(function(ans) {
        if(ans) {
          // console.log('there are cars');
          get().then(function(result) {
            var carData = result.data[0].data;
            // console.log(carData);
            _.each(carData, function(data, field) {
              formData[field] = {
                value: (data.dataType === 'boolean') ? false : null,
                log: data.log,
                dataType: data.dataType,
              };
            });
            // console.log(fromData);
            deferred.resolve({
              formData: formData,
              representativeData: carData
            });
            deferred.reject(new Error('Error initializing car form data'));
          });
        } else {
          // console.log('there are no cars');
          deferred.resolve({
            formData: getDefaultCar().data,
            representativeData: {}
          });
          deferred.reject(new Error('Error initializing car form data'));
        }
      });

      return deferred.promise;
    }

    // same as map except for one
    function simplify(object, identifier) {
      return {
        id: object.id,
        identifierValue: object.data[identifier].value
      };
    }

    function updateIdentifier(cars, currentVal, newVal) {
      if(currentVal !== newVal) {
        _.each(cars, function(car) {
            car.identifier = newVal;
            // console.log('updating identifier:',car);
            dataService.updateCar(car);
        });
      }

      $state.forceReload();
    }

    function _updateIdentifier(identifier) {
      get().then(function(result) {
        var cars = result.data;
        _.each(cars, function(car) {
          car.identifier = identifier;
          update(car);
        });
      });
    }

    /////////////////
    /// Logs CRUD ///
    /////////////////

    function getLogDates() {
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

    function createLog(data, weekOf) {
      return {
        data: data,
        weekOf: weekOf,
        createdAt: new Date(),
      };
    }

    function createLogs(logDates, blankLogData) {
      var logs = [];

      _.each(logDates, function(logDate) {
        logs.push({
          data: blankLogData,
          weekOf: logDate,
          createdAt: new Date()
        });
      });

      return logs;
    }

    function getFieldsToBeLogged() {
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

    function createLogData() {
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

    function populateLogs(car) {
      // promise groups
      // 1. getFieldsToBeLogged -> createLogData
      // 2. get -> getLogDates
      // 3. 1,2 -> createLogs (_.each combine with createLog)

      var deferred = $q.defer();
      var promise1 = getFieldsToBeLogged(car).then(createLogData, errcb);
      var promise2 = get().then(getLogDates, errcb);

      $q.all([promise1, promise2]).then(function(values) {
        var logs = createLogs(values[1], values[0]);
        car.logs = logs;
        deferred.resolve(car);
        deferred.reject(new Error('Error populating logs for car ' + car.id));
      }, function(err) {
        console.error(err);
      });

      return deferred.promise;
    }
  }]);
})();
