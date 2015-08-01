'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:PtgCtrl
 * @description
 * # PtgCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('PtgCtrl', function (ptgViewData, basicDriverData) {
    this.logs = ptgViewData.data; 
    this.drivers = basicDriverData.data;
  });
