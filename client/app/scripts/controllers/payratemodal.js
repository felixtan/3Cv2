'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:PayratemodalCtrl
 * @description
 * # PayratemodalCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('PayRateModalCtrl', function ($scope, $modal) {
    $scope.animationsEnabled = true;
    // $scope.payRate = " ";

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'payRateModal',
            controller: 'PayRateModalInstanceCtrl',
            size: size
        });

        modalInstance.result.then(function (payRate) {
            $scope.payRate = payRate;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });
