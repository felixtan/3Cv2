'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:PersoneditformmodalCtrl
 * @description
 * # PersoneditformmodalCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('PersonEditFormModalCtrl', function ($scope, $modal, dataService) {
    $scope.person = {};
    $scope.animationsEnabled = true;

    $scope.open = function (size, person, type) {
        $scope.person.data = person;
        $scope.person.type = type;
        var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'personEditFormModal',
                controller: 'PersonEditFormModalInstanceCtrl',
                size: size,
                resolve: {
                    getGasCards: function(dataService) {
                        return dataService.getGasCards();
                    },
                    getEzPasses: function(dataService) {
                        return dataService.getEzPasses();
                    },
                    getPerson: function() {
                        return $scope.person;
                    },
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
