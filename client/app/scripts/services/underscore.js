(function() {
  'use strict';

  function UnderscoreService($window) {
    if (!$window._) {
      // get it from somewhere else or mock
      console.error(new Error("_ not found in window."));
    }

    return $window._;
  }

  UnderscoreService.$inject = ['$window'];

  /**
   * @ngdoc service
   * @name clientApp.underscore
   * @description
   * # underscore
   * Factory in the clientApp.
   */
  angular.module('clientApp')
    .factory('_', UnderscoreService);
})();
