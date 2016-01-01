'use strict';

/**
 * @ngdoc service
 * @name clientApp.prospectHelpers
 * @description
 * # prospectHelpers
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('prospectHelpers', function ($q, dataService, $state) {

    var mapObject = function(objects, identifier) {
      return _.map(objects, function(object) {
          return {
              id: object.id,
              identifierValue: object.data[identifier].value
          };
      });
    };

    // Public API here
    return {
      mapObject: mapObject
    };
  });
