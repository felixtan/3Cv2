'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddfieldmodalCtrl
 * @description
 * # AddfieldmodalCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddFieldModalCtrl', function (dataService, $scope, $modal) {
    
    $scope.formData = {};

    $scope.open = function(size) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/addfieldmodal.html',
            controller: 'AddFieldModalInstanceCtrl',
            size: size,
            resolve: {
                getCars: function(dataService) {
                    return dataService.getCars();
                }
            }
        });

        modalInstance.result.then(function (formData) {
            $scope.formData = formData;
        }, function() {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
  });
