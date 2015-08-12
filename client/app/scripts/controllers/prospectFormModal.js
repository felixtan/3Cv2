'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:NewprospectformmodalCtrl
 * @description
 * # NewprospectformmodalCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('prospectFormModalCtrl', function ($scope, $modal) {
    
    $scope.items = ['item1', 'item2', 'item3'];

    $scope.formData = {};

    $scope.animationsEnabled = true;

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'newprospectformmodal',
            controller: 'prospectFormModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
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
 
