'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:NewprospectformmodalCtrl
 * @description
 * # NewprospectformmodalCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ProspectFormModalCtrl', function ($scope, $modal) {
    $scope.formData = {};
    $scope.animationsEnabled = true;

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'views/newprospectformmodal.html',
            controller: 'ProspectFormModalInstanceCtrl',
            size: size
        });

        modalInstance.result.then(function (formData) {
            $scope.formData = formData;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    // $scope.toggleAnimation = function () {
    //     $scope.animationsEnabled = !$scope.animationsEnabled;
    // };

});
 
