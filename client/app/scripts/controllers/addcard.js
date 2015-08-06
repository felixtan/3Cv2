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
    this.data.routeFor = {
        "Gas Card": "gas-cards",
        "Ez Pass": "ezpass"
    };
    this.data.typeNames = Object.keys(this.data.routeFor);

    this.reset = function() {
        this.data = {};
    };

    this.saveCard = function() {
        // console.log(this.data);
        $http.post('/api/assets/' + this.data.routeFor[this.data.type], { 
            number: this.data.number,
            driverId: this.data.driver
        });
    };
  });
