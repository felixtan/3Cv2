'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProspectProfileCtrl
 * @description
 * # ProspectProfileCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ProspectProfileCtrl', function ($scope, getProspect, getProspects, getProspectStatuses) {
    $scope.getProspect = function() {
        $scope.prospect = getProspect.data;
    };
    $scope.getProspect();
  });
