'use strict';

/**
 * @ngdoc service
 * @name clientApp.driverHelpers
 * @description
 * # driverHelpers
 * Service in the clientApp.
 */
angular.module('clientApp')
  .factory('fieldHelpers', function ($q, dataService, ENV) {

    var getOrganizationId = function() {
      return (ENV.name === ('production' || 'staging')) ? $scope.user.customData.organizationId : '3Qnv2pMAxLZqVdp7n8RZ0x';
    };

});