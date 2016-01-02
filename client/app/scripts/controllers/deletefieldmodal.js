'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DeletefieldmodalCtrl
 * @description
 * # DeletefieldmodalCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DeleteFieldModalCtrl', function (dataService, $scope, $modal, $state) {

    $scope.open = function (size, thing) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/deletefieldmodal.html',
            controller: 'DeleteFieldModalInstanceCtrl',
            size: size,
            resolve: {
                thing: function() {
                    return thing;   // object { type: x, value: y } such that x ∈ ['field', 'log'] and y ∈ $scope.fields or $scope.dates
                },
                getCars: function(dataService) {
                    return (($state.includes('carProfile') || ($state.includes('dashboard.cars'))) ? dataService.getCars() : {});
                },
                getDrivers: function(dataService) {
                    return (($state.includes('driverrProfile') || ($state.includes('dashboard.drivers'))) ? dataService.getDrivers() : {});
                },
                getProspects: function(dataService) {
                    return (($state.includes('prospectProfile') || ($state.includes('dashboard.prospects'))) ? dataService.getProspects() : {});
                }
            }
        });

        modalInstance.result.then(function (input) {
            $scope.input = input;
            console.log('passed back from DeleteFieldModalInstanceCtrl:', input);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
  });
