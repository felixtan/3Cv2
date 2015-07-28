'use strict';

/**
 * @ngdoc service
 * @name clientApp.carService
 * @description
 * # carService
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('assignmentService', function ($http) {

    // Public API here
    return {
      getAss: function () {
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
