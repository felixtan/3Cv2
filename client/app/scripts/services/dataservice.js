'use strict';

/**
 * @ngdoc service
 * @name clientApp.carService
 * @description
 * # carService
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('dataService', function ($http) {

    // Public API here
    return {
      getAss: function () {
        return $http.get('/api/assignments')
                  .success(function(data) {
                    return data;
                  })
                  .error(function(data) {
                    console.error(data);          // TODO: handle these errors better
                  });
      },

      getDrivers: function () {
       return $http.get('/api/assignments/drivers')
                  .success(function(data) {
                    return data;
                  })
                  .error(function(data) {
                    console.error(data);
                  });
      },

      getCars: function () {
        return $http.get('/api/assignments/cars')
                  .success(function(data) {
                    return data;
                  })
                  .error(function(data) {
                    console.error(data);
                  });
      }
      
    };
  });
