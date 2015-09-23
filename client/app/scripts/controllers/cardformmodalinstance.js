'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CardformmodalinstanceCtrl
 * @description
 * # CardformmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CardFormModalInstanceCtrl', function ($state, $http, $scope, $modalInstance) {
    $scope.animationsEnabled = true;
    $scope.formData = {};
    $scope.routeFor = {
        "Gas Card": "gas-cards",
        "EZ Pass": "ez-passes"
    };
    $scope.typeNames = Object.keys($scope.routeFor);

    $scope.submit = function () {
        $http.post('/api/assets/' + $scope.routeFor[$scope.formData.type], $scope.formData)
            .then(function() {   
                $scope.reset();
            }, function(err) {
                console.error(err);
            });
    };

    $scope.reset = function () {
      $scope.formData = {};
      $scope.cardForm.$setPristine();
      $scope.cardForm.$setUntouched();
      $state.forceReload();
    };

    $scope.close = function () {
      $scope.reset();
      $modalInstance.dismiss('cancel');
    };
  });
