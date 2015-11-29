'use strict';

/**
 * @ngdoc service
 * @name clientApp.carService
 * @description
 * # carService
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('dataService', function ($http, $q, ENV) {

    // testing with account with organizatinId 3Qnv2pMAxLZqVdp7n8RZ0x
    var params = (ENV.name === ('production' || 'staging')) ? {} : { organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x' };

    // Learning
    // This results in false
    // console.log(ENV.name === ('production' || 'staging'));
    // 
    // This results in 'staging'
    // console.log(ENV.name === 'production' || 'staging');

    // Public API here
    return {
      getAss: function () {
        var promise = $http.get('/api/assignments', params);
        var deferred = deferred || $q.defer();

        promise.then(function(data) {
          deferred.resolve(data);
        }, function(err) {
          deferred.reject(err);
        });

        return deferred.promise;
      },

      getDriversFull: function() {
        var promise = $http.get('/api/drivers', params);
        var deferred = deferred || $q.defer();

        promise.then(function(data) {
          deferred.resolve(data);
        }, function(err) {
          deferred.reject(err);
        });

        return deferred.promise;
      },

      getDrivers: function () {
        var promise = $http.get('/api/assignments/drivers', params);
        var deferred = deferred || $q.defer();

        promise.then(function(data) {
          deferred.resolve(data);
        }, function(err) {
          deferred.reject(err);
        });

        return deferred.promise;
      },

      getCars: function () {
        return $http({
                      method: 'GET',
                      url: '/api/cars',
                      params: params
                  })
                  .then(function(data) {
                    return data;
                  }, function(err) {
                    throw err;
                  });
      },

      getCar: function (id) {
        return $http.get('/api/cars/' + id)
                  .then(function(data) {
                    return data;
                  }, function(err) {
                    console.error(err);
                  });
      },

      getCarProperties: function () {
        return $http.get('/api/settings/cars', params)
                  .then(function(data) {
                    return data;
                  }, function(err) {
                    console.error(err);
                  });
      },

      getPtgLogs: function () {
        return $http.get('/api/logs/ptg', params)
                 .then(function(data) {
                  return data;
                }, function(err) {
                  console.error(err);
                });
      },

      getGasCards: function() {
        return $http.get('/api/assets/gas-cards', params)
                  .then(function(data) {
                    return data;
                  }, function(err) {
                    console.error(err);
                  });
      },

      getEzPasses: function() {
        return $http.get('/api/assets/ez-passes', params)
                  .then(function(data) {
                    return data;
                  }, function(err) {
                    console.error(err);
                  });
      },

      getProspects: function() {
        return $http.get('/api/prospects', params)
                  .then(function(data) {
                    return data;
                  }, function(err) {
                    console.error(err);
                  });
      },

      updateCar: function(car, params) {
        return $http({
          method: 'PUT',
          url: '/api/logs/cars/' + car.id,
          params: params,
          data: car
        })
        .then(function(data) {
          return data;
        }, function(err) {
          console.error(err);
        });
      },

      deleteField: function(index) {
        // return $http.delete{}
      }
    };
  });
