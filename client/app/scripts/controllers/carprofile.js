'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarprofileCtrl
 * @description
 * # CarprofileCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarProfileCtrl', function ($scope, $window, getCar, $http, $stateParams) {
    var _ = $window._;
    this.data = getCar.data.data;
    this.fields = _.keys(getCar.data.data);

    $scope.tabs = [
        { title: 'Data', content: 'Data' },
        { title: 'Logs', content: 'Logs '},
        { title: 'Drivers', content: 'Drivers' }
    ];


  });
