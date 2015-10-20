'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SettingsDriversmodelCtrl
 * @description
 * # SettingsDriversmodelCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DriversModelCtrl', function ($scope, $http) {
    $scope.submitModel = function() {
        $http.post('/migrations/drivers', {}).then(function() {
            console.log('Drivers model submitted.');
        });
    }
  });
