'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CardformmodalCtrl
 * @description
 * # CardformmodalCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CardFormModalCtrl', function ($scope, $modal) {
    $scope.formData = {};

    $scope.animationsEnabled = true;

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'views/cardformmodal.html',
            controller: 'CardFormModalInstanceCtrl',
            size: size
        });

        modalInstance.result.then(function (formData) {
            $scope.formData = formData;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });
