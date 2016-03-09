'use strict';

/**
 * @ngdoc service
 * @name clientApp.carHelpers
 * @description
 * # carHelpers
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('carHelpers', function (ENV, $q, dataService, $state) {
  
  //////////////////////////
  //  Data CRUD and Forms //
  //////////////////////////

  var getCars = dataService.getCars;
  var saveCar = dataService.createCar;
  var updateCar = dataService.updateCar;

  var getOrganizationId = function() {
    return (ENV.name === ('production' || 'staging')) ? $scope.user.customData.organizationId : '3Qnv2pMAxLZqVdp7n8RZ0x';
  };

  var thereAreCars = function() {
    var deferred = $q.defer();
    getCars().then(function(result) {
      deferred.resolve((typeof result.data[0] !== 'undefined'));
      deferred.reject(new Error('Error determining if there are cars.'));
    });
    return deferred.promise;
  };

  var getFields = function() {
    var deferred = $q.defer();
    getCars().then(function(result) {
      deferred.resolve(Object.keys(result.data[0].data));
      deferred.reject(new Error('Failed to get fields'));
    });
    return deferred.promise;
  };

  var getIdentifier = function() {
    var deferred = $q.defer();
    
    thereAreCars().then(function(result) {
      if(result) {
        getCars().then(function(result) {
          var driver = result.data[0];
          deferred.resolve(driver.identifier);
          deferred.reject(new Error("Error getting identifier."));
        });
      } else {
        deferred.resolve(null);
        deferred.reject(new Error("Error getting identifier."));
      }
    });

    return deferred.promise;
  };

  var createCar = function(carData, _identifier, assetType) {
    var deferred = $q.defer();
    if(carData.assetType) delete carData.assetType;
    getIdentifier().then(function(identifier) {
      createLogData().then(function(logData) {
        console.log(logData);
        getLogDates().then(function(logDates) {
          console.log(logDates);
          createLogs(logDates, logData).then(function(logs) {
            console.log(logs);

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
    });

    return deferred.promise;
  };

  var getDefaultCar = function() {
    return {
      identifier: null,
      data: {},
      logs: [],
      driversAssigned: [],
      organizationId: getOrganizationId()
    };
  };

  var getFormDataAndRepresentative = function() {
    var deferred = $q.defer();
    var formData = {};

    thereAreCars().then(function(ans) {
      if(ans) {
        // console.log('there are cars');
        getCars().then(function(result) {
          var carData = result.data[0].data;
          // console.log(car);
          _.each(Object.keys(carData), function(field) {
            formData[field] = {
              value: null,
              log: carData[field].log,
              dataType: carData[field].dataType || null,
              type: carData[field].type || null
            }
          });
          deferred.resolve({
            formData: formData,
            representativeData: carData 
          });
          deferred.reject(new Error('Error initializing car form data'));
        });
      } else {
        console.log('there are no cars');
        deferred.resolve({
          formData: getDefaultCar().data,
          representativeData: {}
        });
        deferred.reject(new Error('Error initializing car form data'));
      }
    });

    return deferred.promise;
  };

  var mapObject = function(objects, identifier) {
    return _.map(objects, function(object) {
        // console.log(object.data);
        // console.log(identifier);
        return {
            id: object.id,
            identifierValue: object.data[identifier].value
        };
    });
  };

  // same as map except for one
  var simplify = function(object, identifier) {
    return {
      id: object.id,
      identifierValue: object.data[identifier].value
    }
  };

  var updateIdentifier = function(cars, currentVal, newVal) {
    if(currentVal !== newVal) {
      _.each(cars, function(car) {    
          car.identifier = newVal;
          // console.log('updating identifier:',car);
          dataService.updateCar(car);
      });
    }

    $state.forceReload();
  };

  var _updateIdentifier = function(identifier) {
    getCars().then(function(result) {
      var cars = result.data;
      _.each(cars, function(car) {
        car.identifier = identifier;
        updateCar(car);
      });
    });
  };

  /////////////////
  /// Logs CRUD ///
  /////////////////

  var getLogDates = function() {
    var deferred = $q.defer();
    var logDates = [];

    getCars().then(function(result) {
      var cars = result.data;
      
      if(cars.length > 0) {
        // TODO: Do we have to do a double each here? If we can ensure that all 
        // car logs have the same dates, then we can just take the first car cars[0]
        _.each(cars, function(car) {
          _.each(car.logs, function(log) {
            logDates.push(log.weekOf);
            logDates = _.uniq(logDates.sort(), true).reverse();
          });
        });
      }

      deferred.resolve(logDates);
      deferred.reject(new Error('Error getting log dates'));
    });

    return deferred.promise;
      
    // if(existingCars.constructor === Object) {
    //   cars = existingCars.data;   // should be from dataService
    //   getEm(cars).then(function(logDates) {
    //     deferred1.resolve(logDates);
    //     deferred1.reject(new Error('Error getting log dates'));
    //   });
    // } else if(existingCars.constructor === Array) {
    //   cars = existingCars;
    //   getEm(cars).then(function(logDates) {
    //     deferred1.resolve(logDates);
    //     deferred1.reject(new Error('Error getting log dates'));
    //   });
    // } else {
    //   // idk wtf it is
    //   deferred1.reject(new Error('Invalid existingCars data type:', existingCars));
    // }
    
    // return deferred1.promise;
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
    deferred.reject(new Error("Error creating logs"));
    return deferred.promise;
  };

  var getFieldsToBeLogged = function() {
    var deferred = $q.defer();
    var fields = [];

    getCars().then(function(result) {
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
  };

  var createLogData = function() {
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
  };

  var populateLogs = function(car) {
    // promise groups
    // 1. getFieldsToBeLogged -> createLogData
    // 2. getCars -> getLogDates
    // 3. 1,2 -> createLogs (_.each combine with createLog)

    var deferred = $q.defer();
    var errcb = function(err) { console.error(err) };
    var promise1 = getFieldsToBeLogged(car).then(createLogData, errcb);
    var promise2 = getCars().then(getLogDates, errcb);

    $q.all([promise1, promise2]).then(function(values) {
      createLogs(values[1], values[0]).then(function(logs) {
        car.logs = logs;
        deferred.resolve(car);
        deferred.reject(new Error('Failed to populate logs for car ' + car.id));
      }, errcb);
    }, errcb);

    return deferred.promise;
  };

  // Public API here
  return {

    // Data
    getCars: getCars,
    updateCar: updateCar,
    saveCar: saveCar,
    createCar: createCar,
    thereAreCars: thereAreCars,
    getDefaultCar: getDefaultCar,
    getFields: getFields,
    mapObject: mapObject,
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
});