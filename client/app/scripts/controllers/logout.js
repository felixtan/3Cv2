'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('LogoutCtrl', function ($state) {
    setTimeout(function() {
        $state.go('login');
    }, 3000);
  });
