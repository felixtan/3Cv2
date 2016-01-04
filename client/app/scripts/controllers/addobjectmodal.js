'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddobjectmodalCtrl
 * @description
 * # AddobjectmodalCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddObjectModalCtrl', function ($state, dataService, $scope, $modal) {
    
    $scope.open = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/addobjectmodal.html',
            controller: 'AddObjectModalInstanceCtrl',
            size: 'md'
        });

        modalInstance.result.then(function (formData) {
            $state.forceReload();
        }, function() {
            $state.forceReload();
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });
