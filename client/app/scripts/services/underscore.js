'use strict';

/**
 * @ngdoc service
 * @name clientApp.underscore
 * @description
 * # underscore
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('underscore', function ($window) {
    return {
      _: $window._
    };
  });
