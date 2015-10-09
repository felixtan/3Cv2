'use strict';

/**
 * @ngdoc service
 * @name clientApp.carService
 * @description
 * # carService
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('dataService', function ($http, $q) {

    // Public API here
    return {
      getAss: function () {
        var promise = $http.get('/api/assignments');
        var deferred = deferred || $q.defer();

        promise.then(function(data) {
          deferred.resolve(data);
        }, function(err) {
          deferred.reject(err);
        });

        return deferred.promise;
      },

      getDriversFull: function() {
        var promise = $http.get('/api/drivers');
        var deferred = deferred || $q.defer();

        promise.then(function(data) {
          deferred.resolve(data);
        }, function(err) {
          deferred.reject(err);
        });

        return deferred.promise;
      },

      getDrivers: function () {
        var promise = $http.get('/api/assignments/drivers');
        var deferred = deferred || $q.defer();

        promise.then(function(data) {
          deferred.resolve(data);
        }, function(err) {
          deferred.reject(err);
        });

        return deferred.promise;
      },

      getCars: function () {
        return $http.get('/api/assignments/cars')
                  .success(function(data) {
                    return data;
                  })
                  .error(function(err) {
                    console.error(err);
                  });
      },

      getPtgLogs: function () {
        return $http.get('/api/logs/ptg')
                  .success(function(data) {
                    return data;
                  })
                  .error(function(err) {
                    console.error(err);
                  });
      },

      getGasCards: function() {
        return $http.get('/api/assets/gas-cards')
                  .success(function(data) {
                    return data;
                  })
                  .error(function(err) {
                    console.error(err);
                  });
      },

      getEzPasses: function() {
        return $http.get('/api/assets/ez-passes')
                  .success(function(data) {
                    return data;
                  })
                  .error(function(err) {
                    console.error(err);
                  });
      },

      getProspects: function() {
        return $http.get('/api/prospects')
                  .success(function(data) {
                    return data;
                  })
                  .error(function(err) {
                    console.error(err);
                  });
      },

      getMaintenanceLogs: function() {
        return $http.get('/api/logs/maintenance')
                  .success(function(data) {
                    return data;
                  })
                  .error(function(err) {
                    console.error(err);
                  });
      }
    };
  });
