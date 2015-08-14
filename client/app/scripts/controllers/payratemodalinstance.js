'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:PayratemodalinstanceCtrl
 * @description
 * # PayratemodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('payRateModalInstanceCtrl', function ($scope, $modalInstance) {

    $scope.submit = function () {
        $modalInstance.close($scope.payRate);
    };

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    }
  });
