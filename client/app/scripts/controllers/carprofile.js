'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarprofileCtrl
 * @description
 * # CarprofileCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarProfileCtrl', function (getCar, $http, $stateParams) {
    this.data = getCar.data;
  });
