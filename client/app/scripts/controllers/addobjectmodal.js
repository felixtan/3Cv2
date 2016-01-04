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
            size: 'md',
            resolve: {
                // getCars: function(dataService) {
                //     return (($state.includes('carProfile') || $state.includes('dashboard.cars')) ? dataService.getCars() : {});
                // },
                // getDrivers: function(dataService) {
                //     return (($state.includes('driverProfile') || $state.includes('dashboard.drivers')) ? dataService.getDrivers() : {});
                // },
                // getProspects: function(dataService) {
                //     return (($state.includes('prospectProfile') || $state.includes('dashboard.prospects')) ? dataService.getProspects() : {});  
                // }
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
