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
                  .success(function(data) {
                    return data;
                  })
                  .error(function(err) {
                    console.error(err);
                  });
      },

      getCar: function (id) {
        return $http.get('/api/cars/' + id)
                  .success(function(data) {
                    return data;
                  })
                  .error(function(err) {
                    throw err;
                  });
      },

      getCarProperties: function () {
        return $http.get('/api/settings/cars', params)
                  .success(function(data) {
                    return data;
                  })
                  .error(function(err) {
                    throw err;
                  });
      },

      getPtgLogs: function () {
        return $http.get('/api/logs/ptg', params)
                  .success(function(data) {
                    return data;
                  })
                  .error(function(err) {
                    console.error(err);
                  });
      },

      getGasCards: function() {
        return $http.get('/api/assets/gas-cards', params)
                  .success(function(data) {
                    return data;
                  })
                  .error(function(err) {
                    console.error(err);
                  });
      },

      getEzPasses: function() {
        return $http.get('/api/assets/ez-passes', params)
                  .success(function(data) {
                    return data;
                  })
                  .error(function(err) {
                    console.error(err);
                  });
      },

      getProspects: function() {
        return $http.get('/api/prospects', params)
                  .success(function(data) {
                    return data;
                  })
                  .error(function(err) {
                    console.error(err);
                  });
      },

      getAllCarLogs: function () {
        return $http({
                      method: 'GET',
                      url:'/api/logs/cars', 
                      params: params
                  })
                  .success(function(data) {
                    return data;
                  })
                  .error(function(err) {
                    console.error(err);
                  });
      }
    };
  });
