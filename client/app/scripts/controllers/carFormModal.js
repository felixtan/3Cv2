'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarformmodalCtrl
 * @description
 * # CarformmodalCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarFormModalCtrl', function ($scope, $modal, dataService) {
    
    $scope.open = function () {

        var modalInstance = $modal.open({
            animation: true,
            backdrop: 'static',
            templateUrl: 'views/carformmodal.html',
            controller: 'CarFormModalInstanceCtrl',
            size: 'md',
            resolve: {
                getCars: function(dataService) {
                    return dataService.getCars();
                }
            }
        });

        modalInstance.result.then(function () {
            console.log('Modal dismissed at: ' + new Date());
            $state.go('main');
        });
    };
  });
