'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function (carHelpers, $state, $modal, $filter, $q, $scope, getCars) {
    
    $scope.tabs = [
        { title: 'Cars', route: 'dashboard.cars', active: true },
        { title: 'Drivers', route: 'dashboard.drivers', active: false }
    ];

    $scope.cars = getCars.data;
    $scope.simpleCars = carHelpers.mapObject($scope.cars, $scope.cars[0].identifier);
    $scope.thereAreCars = function() { return (typeof $scope.cars[0] !== 'undefined'); };
    $scope.identifier = $scope.thereAreCars() ? $scope.cars[0].identifier : null;

    // submit xeditable row form by pressing enter
    // will then call updateDriver
    // to use this add following attribute to button element
    // e-ng-keypress="keypress($event, driverRowForm)"
    $scope.keypress = function(e, form) {
        if (e.which === 13) {
            form.$submit();
        }
    };
});