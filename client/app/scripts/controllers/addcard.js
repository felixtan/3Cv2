'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddgascardJsCtrl
 * @description
 * # AddgascardJsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddCardCtrl', function ($http, getDrivers) {
    this.drivers = getDrivers.data;
    this.data = {};

    this.reset = function() {
        this.data = {};
    };

    this.saveCard = function() {
        console.log(this.data);
        $http.post('/api/assets/gas-cards', { 
            number: this.data.number,
            driverId: this.data.driver
        });
    };
  });
