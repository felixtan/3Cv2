'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarformmodalCtrl
 * @description
 * # CarformmodalCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('carFormModalCtrl', function ($scope, $modal, dataService) {
    $scope.formData = {};

    $scope.animationsEnabled = true;

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'carformmodal',
            controller: 'carFormModalInstanceCtrl',
            size: size,
            resolve: {
                getDrivers: function(dataService) {
                    return dataService.getDrivers();
                }
            }
        });

        modalInstance.result.then(function (formData) {
            $scope.formData = formData;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });
