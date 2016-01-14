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
    
    $scope.newField = null;

    $scope.open = function(size) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/addfieldmodal.html',
            controller: 'AddFieldModalInstanceCtrl',
            size: size,
            resolve: {
                getCars: function(dataService) {
                    return (($state.includes('carProfile') || $state.includes('dashboard.cars')) ? dataService.getCars() : {});
                },
                getDrivers: function(dataService) {
                    return (($state.includes('driverProfile') || $state.includes('dashboard.drivers')) ? dataService.getDrivers() : {});
                },
                getProspects: function(dataService) {
                    return (($state.includes('prospectProfile') || $state.includes('dashboard.prospects')) ? dataService.getProspects() : {});  
                },
                getAssets: function(dataService) {
                    return (($state.includes('assetProfile') || $state.includes('dashboard.assets')) ? dataService.getAssets() : {});
                }
            }
        });

        modalInstance.result.then(function (newField) {
            $scope.newField = newField;
            $state.forceReload();
        }, function() {
            $state.forceReload();
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });
