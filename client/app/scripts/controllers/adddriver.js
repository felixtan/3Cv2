'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AdddriverCtrl
 * @description
 * # AdddriverCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddDriverCtrl', function (getCars, $http) {
    this.cars = getCars.data;
    this.data = {};
    
    this.reset = function() {
        this.data = {};
    };

    this.saveDriver = function() {
        $http.post('/api/drivers', {
            givenName: this.data.givenName,
            surName: this.data.surName,
            driversLicenseNum: this.data.driversLicenseNum,
            phoneNumber: this.data.phoneNumber,
            email: this.data.email,
            address: this.data.address,
            description: this.data.description,
            carId: this.data.car
        })
        .success(function(data) {
            // TODO: create modal popup telling the user 
            console.log('New driver saved.');
        })
        .error(function(err) {
            console.error(err);
        });
    };
  });
