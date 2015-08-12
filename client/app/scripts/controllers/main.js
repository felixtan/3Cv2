'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($modal, $route, $filter, $q, $http, $scope, getProspects, getCarsAndDrivers) {

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
        $http.put('/api/prospects/' + id, {
            status: newStatus
        }).then(function() {
            console.log('Prospect ' + id + ' now has status ' + newStatus + '.');
        }, function(err) {
            console.error(err);
        });
    }

    $scope.filterProspectData = function(id) {
        return $q(function(resolve, reject) {
            // find the prospect 
            var prospect = $filter('filter')($scope.prospects, function(data) {
                return data.id === id;
            })[0];
            delete prospect.status;
            delete prospect.$$hashKey;
            delete prospect.createdAt;
            delete prospect.id;
            delete prospect.updatedAt;
            delete prospect.userId;
            resolve(prospect);
            reject(new Error('Failed to filter prospect data before promoting to driver.'));
        });
    }

    // Get id of car when a driver or prospect is sorted into it
    $scope.getCarId = function(eventItem) {
        return $q(function(resolve, reject) {
            resolve(parseInt(angular.element(eventItem).parent().data('carid')));
            reject(new Error('Failed to get car id for new driver.'));
        });
    }

    // Get the car a driver/prospect is reassigned/assigned to
    $scope.getCarInScope = function(id) {
        return $q(function(resolve, reject) {
            resolve($filter('filter')($scope.cars, function(car) {
                return car.id === id;
            })[0]);
            reject(new Error('Failed to extract car data for updating the scope.'));
        });
    }

    $scope.updateDriverAssignment = function(driverId, oldCar, newCar) {
        $http.put('/api/assignments/drivers/' + driverId, {
            oldCar: oldCar,
            newCar: newCar
        }).then(function(data) {
            console.log(data.data.msg);
        }).then(function(err) {
            console.error(err);
        });
    }

    // Makes lists sortable when all ng-repeats are finished
    $scope.$on('repeatFinished', function() {
        $scope.getProspectListElems().then(function(prospectListElems) {
            
            // Embue prospect objects with sortability across statuses and to car list
            [].forEach.call(prospectListElems, function(prospectListElem) {
                $scope.sortableConfigs.push(new Sortable(prospectListElem, {
                    group: 'humans',
                    draggable: 'tr',
                    handle: '.drag-handle',
                    animation: 150,
                    onEnd: function(event) {
                        var id = angular.element(event.item).data('id');
                        var toList = angular.element(event.item).parent().data('list');

                        if(toList === 'prospect') {
                            var oldStatus = angular.element(event.item).data('status').toLowerCase();
                            var newStatus = angular.element(event.item).parent().data('status').toLowerCase();
                            if(newStatus !== oldStatus){
                                $scope.updateProspectStatus(id, newStatus); 
                            }
                        } else if(toList === 'driver') {
                            $scope.filterProspectData(id).then(function(prospect) {
                                $scope.getCarId(event.item).then(function(carId) {
                                    prospect.carId = carId;
                                    $http.post('/api/drivers', prospect).then(function(driver) {
                                        // console.log('Promoted prospect ' + driver.data.givenName + ' ' + driver.data.surName + ' to driver.');
                                        $http.delete('/api/prospects/'+id).then(function() {
                                            // console.log(data.data.msg);
                                            $route.reload();    // Temp fix for reloading the view so the UI is accurate
                                        }, function(err) {
                                            console.error(err);
                                        });
                                    }, function(err) {
                                        console.error(err);
                                    });

                                });
                            });
                        }
                    }
                }));
            });
            
            // Embue car objects with sortability across list
            $scope.getCarListElem().then(function(carListElem) {
                $scope.sortableConfigs.push(new Sortable(carListElem, {
                    draggable: 'div.car',
                    handle: '.drag-handle-car',
                    animation: 150 
                    // store: {
                    //     get: function(sortable) {
                    //         var order = localStorage.getItem(sortable.options.group);
                    //         console.log(order);
                    //         return order ? order.split('|') : [];
                    //     },
                    //     set: function(sortable) {
                    //         var order = sortable.toArray();
                    //         console.log(order);
                    //         localStorage.setItem(sortable.options.group, order.join('|'));
                    //     }
                    // }
                }));

                // Embue driver objects with sortability across cars and to prospect list
                $scope.getDriverListElems().then(function(driverListElems) {
                    [].forEach.call(driverListElems, function(driverListElem) {
                        $scope.sortableConfigs.push(new Sortable(driverListElem, {
                            group: 'humans',
                            draggable: 'tr',
                            handle: '.drag-handle',
                            animation: 150,
                            onEnd: function(event) {
                                var id = angular.element(event.item).data('id');
                                var toList = angular.element(event.item).parent().data('list');

                                if(toList === 'driver') {
                                    var oldCar = angular.element(event.item).data('currentcarid');
                                    var newCar = angular.element(event.item).parent().data('carid');

                                    if(oldCar !== newCar) {
                                        $scope.updateDriverAssignment(id, oldCar, newCar);
                                    }
                                } else if(toList === 'prospect') {

                                }
                            }
                        }));
                    }); 
                });
            });
        });
    });
});
