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
      getCars: function () {
        return $http.get('/api/cars')
                  .success(function(data) {
                    console.log('returned from carService.getCars() call:', data);
                    return data;
                  })
                  .error(function(data) {
                    console.error(data);
                  });
      }
    };
  });
