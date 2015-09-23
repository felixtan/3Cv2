'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DriverformmodalJsCtrl
 * @description
 * # DriverformmodalJsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DriverFormModalCtrl', function ($scope, $modal, dataService) {
    $scope.animationsEnabled = true;

    $scope.open = function (size) {
        var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/driverformmodal.html',
                controller: 'DriverFormModalInstanceCtrl',
                size: size,
                resolve: {
                    getCars: function(dataService) {
                        return dataService.getCars();
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
