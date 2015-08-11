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

    var deferred;

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

      getDrivers: function () {
       return $http.get('/api/assignments/drivers')
                  .success(function(data) {
                    return data;
                  })
                  .error(function(err) {
                    console.error(err);
                  });
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

      getProspects: function() {
        return $http.get('/api/prospects')
                  .success(function(data) {
                    return data;
                  })
                  .error(function(err) {
                    console.error(err);
                  });
      }
    };
  });
