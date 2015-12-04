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

    $scope.open = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/cardformmodal.html',
            controller: 'CardFormModalInstanceCtrl',
            size: 'lg'
        });

        modalInstance.result.then(function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });
