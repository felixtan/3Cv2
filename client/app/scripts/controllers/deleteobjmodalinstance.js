'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DeleteobjmodalinstanceCtrl
 * @description
 * # DeleteobjmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DeleteObjModalInstanceCtrl', function (id, dataService, $scope, $modalInstance, $state) {
    $scope.input = null;
    $scope.objectType = null;
    $scope.delete = function(id) { return; };

    // determine the state or ui calling this modal
    if($state.includes('driverProfile')) {
        console.log('called from drivers ui');
        $scope.objectType = 'driver';
        $scope.delete = dataService.deleteDriver;
    } else if($state.includes('carProfile')) {
        console.log('called from cars ui');
        $scope.objectType = 'car';
        $scope.delete = dataService.deleteCar;
    } else {
        console.log('delete field modal called from invalid state', $state.current);
    }
    console.log('object type:', $scope.objectType);

    $scope.submit = function() {
        if($scope.input === 'DELETE') {
            if((typeof id !== 'undefined') && (id !== null)) {
                if(typeof $scope.objectType === 'string') $scope.delete(id);
            }

            $scope.ok();
        }
    };

    $scope.ok = function() {
        $state.forceReload();
        $modalInstance.close({
            type: $scope.objectType,
            id: id
        });
    };

    $scope.close = function () {
        $state.forceReload();
        $modalInstance.dismiss('cancel');
    };
  });
