'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddfieldmodalCtrl
 * @description
 * # AddfieldmodalCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddFieldModalCtrl', function ($state, dataService, $scope, $modal) {
    $scope.formData = {};

    $scope.open = function(size) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/addfieldmodal.html',
            controller: 'AddFieldModalInstanceCtrl',
            size: size,
            resolve: {
                getCars: function(dataService) {
                    return ($state.includes('carProfile') ? dataService.getCars() : {});
                },
                getDrivers: function(dataService) {
                    return ($state.includes('driverProfile') ? dataService.getDrivers() : {});
                },
                getProspects: function(dataService) {
                    return ($state.includes('prospectProfile') ? dataService.getProspects() : {});  
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
