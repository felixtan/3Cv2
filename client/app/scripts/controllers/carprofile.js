'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarprofileCtrl
 * @description
 * # CarprofileCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarProfileCtrl', function ($scope, $window, getCar) {
    var _ = $window._;

    $scope.getCar = function() {
        $scope._car = getCar.data;
    }
    $scope.getCar();

    console.log($scope._car);
    console.log($scope._car.data);

    $scope.getFields = function() {
        $scope.fields = _.keys($scope._car.data);
    }
    $scope.getFields();

    $scope.tabs = [
        { title: 'Data', content: 'Data' },
        { title: 'Logs', content: 'Logs '}
        // { title: 'Drivers', content: 'Drivers' }
    ];


  });
