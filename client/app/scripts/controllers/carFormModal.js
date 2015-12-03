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
    $scope.formData = {};

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/carformmodal.html',
            controller: 'CarFormModalInstanceCtrl',
            size: size,
            resolve: {
                getCars: function(dataService) {
                    return dataService.getCars();
                }
            }
        });

        modalInstance.result.then(function (formData) {
            console.log('passed upon closing car form modal instance:',formData);
            $scope.formData = formData;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });
