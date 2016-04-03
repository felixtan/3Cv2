'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DriversuiCtrl
 * @description
 * # DriversuiCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DriversListCtrl', function ($state, getDrivers, $scope, $modal) {

    $scope.drivers = getDrivers.data;

    $scope.thereAreDrivers = function() {
      return (typeof $scope.drivers[0] !== 'undefined');
    };

    $scope.addObject = function(objectType) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/addobjectmodal.html',
            controller: 'AddObjectModalInstanceCtrl',
            size: 'md',
            resolve: {
                objectType: function() {
                    return objectType;
                },
                getCars: function(dataService) {
                    return (objectType === 'car') ? dataService.getCars() : {};
                },
                getDrivers: function(dataService) {
                    return (objectType === 'driver') ? dataService.getDrivers() : {};
                },
                getProspects: function(dataService) {
                    return (objectType === 'prospect') ? dataService.getProspects() : {};  
                },
                getAssets: function(dataService) {
                    return (objectType === 'asset') ? dataService.getAssets() : {};
                },
                assetType: function() {
                    return null;
                }
            }
        });

        modalInstance.result.then(function (formData) {
            $state.forceReload();
        }, function() {
            $state.forceReload();
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });
