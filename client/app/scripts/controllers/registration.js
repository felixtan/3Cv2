'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RegistrationCtrl', function ($user, $http, $scope) {

    $scope.submit = function (formModel) {
        $user.create(formModel).then(function(account) {
            if(account.status === 'ENABLED') {
                console.log('account registered');
            } else if(account.status === 'UNVERIFIED') {
                console.log('account unverified');
            }
        }).catch(function(err) {
            $scope.error = err.message;
            if($scope.error) console.log($scope.error);
        });
    }
});