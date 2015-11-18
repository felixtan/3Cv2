'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarModelCtrl
 * @description
 * # CarModelCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarModelCtrl', function ($scope, $http, getCarProperties) {
    this.fields = getCarProperties.data;

    $scope.submitModel = function(formObj) {
        $http.post('/api/settings/cars', formObj).then(function() {
            console.log('Drivers model changed.');
        });
    }
  });
