'use strict';

/**
 * @ngdoc service
 * @name clientApp.carService
 * @description
 * # carService
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('carService', function ($http) {

    // Public API here
    return {
      getCarsnDrivers: function () {
        return $http.get('/api/assignments')
                  .success(function(data) {
                    return data;
                  })
                  .error(function(data) {
                    console.error(data);
                  });
      }
    };
  });
