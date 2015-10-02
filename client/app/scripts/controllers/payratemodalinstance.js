'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:PayratemodalinstanceCtrl
 * @description
 * # PayratemodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('PayRateModalInstanceCtrl', function ($state, $scope, $modalInstance) {
    document.onkeypress = function (e) {
        e = e || window.event;
        // use e.keyCode
        if(e.charCode === 13 && !$scope.payRateForm.$invalid) {
            $scope.submit();
        }
    };

    $scope.submit = function () {
        $modalInstance.close($scope.payRate);
    };

    $scope.close = function () {
        $state.forceReload();
        $modalInstance.dismiss('cancel');
    };
  });
