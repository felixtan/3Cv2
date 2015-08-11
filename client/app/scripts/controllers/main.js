'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($q, $http, $scope, getProspects, getCarsAndDrivers) {
    $scope.cars = getCarsAndDrivers.data;
    $scope.prospects = getProspects.data;
    $scope.prospectStatuses = ['Callers', 'Interviewed', 'Waiting', 'Rejected'];
    $scope.sortableConfigs = [];

    $scope.getCarListElem = function() {
        return $q(function(resolve, reject) {
            resolve(angular.element('#carList')[0]);
            reject(new Error('Failed to get car list element.'));
        });
    }

    $scope.getProspectListElems = function() {
        return $q(function(resolve, reject) {
            resolve(angular.element('.prospect-status'));
            reject(new Error('Failed to get list elements.'));
        });
    }

    $scope.getDriverListElems = function() {
        return $q(function(resolve, reject) {
            resolve(angular.element('.driver-list'));
            reject(new Error('Failed to get driver list elements.'));
        });
    }

    $scope.$on('repeatFinished', function() {
        $scope.getProspectListElems().then(function(listElems) {
            
            [].forEach.call(listElems, function(listElem) {
                $scope.sortableConfigs.push(new Sortable(listElem, {
                    group: 'humans',
                    draggable: 'tr',
                    handle: '.drag-handle',
                    animation: 150
                }));
            });

            $scope.getCarListElem().then(function(carListElem) {
                $scope.sortableConfigs.push(new Sortable(carListElem, {
                    draggable: 'div.car',
                    handle: '.drag-handle-car',
                    animation: 150
                }));

                $scope.getDriverListElems().then(function(driverListElems) {
                    [].forEach.call(driverListElems, function(driverListElem) {
                        $scope.sortableConfigs.push(new Sortable(driverListElem, {
                            group: 'humans',
                            draggable: 'tr',
                            handle: '.drag-handle',
                            animation: 150
                        }));
                    }); 
                });
            });
        });
    });
});
