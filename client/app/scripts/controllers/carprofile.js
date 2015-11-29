'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarprofileCtrl
 * @description
 * # CarprofileCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarProfileCtrl', function ($scope, $window, getCar, getCars, $state) {
    $scope.getCar = function() {
        $scope.car = getCar.data;
    }
    $scope.getCar();

    $scope.tabs = [
        { title: 'Data', route: 'carProfile.data', active: false },
        { title: 'Logs', route: 'carProfile.logs' }
        // { title: 'Drivers', content: 'Drivers' }
    ];

  });
