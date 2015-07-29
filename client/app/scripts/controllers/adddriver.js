'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AdddriverCtrl
 * @description
 * # AdddriverCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddDriverCtrl', function (addDriverViewData, $http) {
    this.cars = addDriverViewData.data;
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
        .error(function(data) {
            // TODO: better handle errors
            console.error(data);
        });
    };
  });
