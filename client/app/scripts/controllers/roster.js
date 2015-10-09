'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RosterCtrl
 * @description
 * # RosterCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RosterCtrl', function (getDriversFull, $window, $scope, $state) {
    this.drivers = getDriversFull.data;
    var _ = $window._;

    // get driver obj keys to render column headers
    // remove id, givenName, middleInitial, surName from the array
    this.columns = _.keys(this.drivers[0]);
    this.columns = _.without(this.columns, 'id', 'givenName', 'middleInitial', 'surName', 'createdAt', 'updatedAt');
    console.log(this.columns);
  });
