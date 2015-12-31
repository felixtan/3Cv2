'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarprofileCtrl
 * @description
 * # CarprofileCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarProfileCtrl', function (carHelpers, $scope, getCar, getCars) {


    $scope.getCar = function() {
        $scope.car = getCar.data;
        $scope.simpleCar = carHelpers.simplify($scope.car, $scope.car.identifier);
    }
    $scope.getCar();

    $scope.tabs = [
        { title: 'Data', route: 'carProfile.data' },
        { title: 'Logs', route: 'carProfile.logs' }
        // { title: 'Drivers', content: 'Drivers' }
    ];

  });
