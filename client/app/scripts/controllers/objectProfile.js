'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarprofileCtrl
 * @description
 * # CarprofileCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ObjectProfileCtrl', function (objectId, objectType, objectHelpers, carHelpers, driverHelpers, prospectHelpers, assetHelpers, $scope) {
    
    var ctrl = this;
    $scope.objectType = objectType;

    ctrl.getObject = function () {
        if($scope.objectType === 'car') {
            return carHelpers.getById;
        } else if($scope.objectType === 'driver') {
            return driverHelpers.getById;
        } else if($scope.objectType === 'prospect') {
            return prospectHelpers.getById;
        } else if($scope.objectType === 'asset') {
            return assetHelpers.getById;
        }
    };

    ctrl.getObject()(objectId).then(function(result) {
        $scope.object = result.data;
        $scope.simpleObject = objectHelpers.simplify($scope.object);
    });
  });
