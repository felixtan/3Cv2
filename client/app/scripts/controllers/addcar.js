'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddcarCtrl
 * @description
 * # AddcarCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddcarCtrl', function (addCarViewData, $http) {
    this.drivers = addCarViewData.data;
    this.data = {};
    
    this.reset = function() {
        this.data = {};
    };

    this.saveCar = function() {
        $http.post('/api/cars', {
            tlcNumber: this.data.tlcNumber,
            licensePlateNumber: this.data.licensePlateNumber,
            mileage: this.data.mileage,
            description: this.data.description,
            driverId: this.data.driver
        })
        .success(function(data) {
            // TODO: create modal popup telling the user 
            console.log('New car saved.');
        })
        .error(function(data) {
            // TODO: better handle errors
            console.error(data);
        });
    };
  });
