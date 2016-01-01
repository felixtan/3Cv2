'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProspectstatusmodalCtrl
 * @description
 * # ProspectstatusmodalCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ProspectStatusModalCtrl', function (dataService, $scope, getProspectStatuses, $state, $modalInstance) {
    
    $scope.statuses = getProspectStatuses.data[0];
    $scope.newStatus = { name: null };

    $scope.validForm = function() {
        return (($scope.newStatus.name !== null) && (typeof $scope.newStatus.name !== "undefined"));
    };

    $scope.submit = function() {
        $scope.statuses.statuses.push($scope.newStatus);
        dataService.updateProspectStatuses($scope.statuses);
        $scope.close();
    };

    $scope.reset = function () {
      $scope.newStatus = { name: null };
    };

    $scope.close = function () {
        $state.forceReload();
        $modalInstance.dismiss('cancel');
    };
  });
