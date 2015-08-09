'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($http, $scope, getProspects, getCarsAndDrivers) {
    $scope.cars = getCarsAndDrivers.data;
    $scope.prospects = getProspects.data;
    $scope.prospectStatuses = ['Callers', 'Interviewed', 'Waiting List', 'Rejected'];
    console.log($scope.prospects);
    
    $scope.$on('$viewContentLoaded', function() {
        var carList = angular.element('#carList')[0];
        var sortableCarList = new Sortable.create(carList, {
            animation: 150,
            onEnd: function(event) {
                // indexes are not array style, i.e., it starts form 1
                console.log('cars', $scope.cars);
            }
        });
    });
    
});
