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
    $scope.prospectStatuses = ['Callers', 'Interviewed', 'Waiting List', 'Rejected'];
    $scope.sortableConfigs = [];

    $scope.getCarListElem = function() {
        return $q(function(resolve, reject) {
            resolve(angular.element('#car-list')[0]);
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

    $scope.updateProspectStatus = function(id, newStatus) {
        return $q(function(resolve, reject) {
            $http.put('/api/prospects/' + id, {
                status: newStatus
            }).then(function() {
                console.log('Prospect ' + id + ' now has status ' + newStatus + '.');
            }, function(err) {
                console.error(err);
            });
        });
    }

    // Makes lists sortable
    $scope.$on('repeatFinished', function() {
        $scope.getProspectListElems().then(function(prospectListElems) {
            
            [].forEach.call(prospectListElems, function(prospectListElem) {
                $scope.sortableConfigs.push(new Sortable(prospectListElem, {
                    group: 'humans',
                    draggable: 'tr',
                    handle: '.drag-handle',
                    animation: 150,
                    onEnd: function(event) {
                        var id = angular.element(event.item).data('id');
                        var oldStatus = angular.element(event.item).data('status').toLowerCase();
                        var newStatus = angular.element(event.item).parent().data('status').toLowerCase();

                        if(newStatus !== oldStatus) {
                           $scope.updateProspectStatus(id, newStatus); 
                        }
                    }
                }));
            });

            $scope.getCarListElem().then(function(carListElem) {
                $scope.sortableConfigs.push(new Sortable(carListElem, {
                    draggable: 'div.car',
                    handle: '.drag-handle-car',
                    animation: 150,
                    dropOnEmpty: true
                }));

                $scope.getDriverListElems().then(function(driverListElems) {
                    [].forEach.call(driverListElems, function(driverListElem) {
                        $scope.sortableConfigs.push(new Sortable(driverListElem, {
                            group: 'humans',
                            draggable: 'tr',
                            handle: '.drag-handle',
                            animation: 150,
                            dropOnEmpty: true
                        }));
                    }); 
                });
            });
        });
    });
});
