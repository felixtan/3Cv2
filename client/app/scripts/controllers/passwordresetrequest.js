'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:PasswordresetrequestCtrl
 * @description
 * # PasswordresetrequestCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('PasswordResetRequestCtrl', function () {
    console.log(angular.element('button'));
    // button.removeClass('btn-primary');
    angular.element('button').addClass('btn-success');
    
  });
