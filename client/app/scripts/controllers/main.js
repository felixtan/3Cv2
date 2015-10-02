'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($state, getEzPasses, getGasCards, $modal, $filter, $q, $http, $scope, getProspects, getCarsAndDrivers) {

    $scope.ezPasses = getEzPasses.data;
    $scope.gasCards = getGasCards.data;
    $scope.carListCollapsed = false;
    $scope.cars = getCarsAndDrivers.data;
    $scope.prospects = getProspects.data;
    $scope.prospectStatuses = ['Callers', 'Interviewed', 'Waiting List', 'Rejected'];
    $scope.sortableConfigs = [];

    $scope.reload = function() {
        $state.forceReload();
    };
    
    // reload page
    $scope.collapse = function(listType) {
        if(listType === 'driver' || 'prospect') {
            if(listType === 'driver') {
                var driverRowForm = angular.element('form.driverRowForm');
                driverRowForm.$cancel();
            } else {
                var prospectRowForm = angular.element('form.prospectRowForm');
                prospectRowForm.$cancel();
            }
        } else {
            console.log('Invalid usage of this method.');
        }
    };

    // oil changed
    this.oilChanged = function(carId) {
        $http.put('/api/cars/' + carId, {
            oilChangeRequired: false
        }).then(function() {
            $state.forceReload();
        }).catch(function(err) {
            console.error(err);
        });
    };

    // submit xeditable row form by pressing enter
    // will then call updateDriver
    // to use this add following attribute to button element
    // e-ng-keypress="keypress($event, driverRowForm)"
    $scope.keypress = function(e, form) {
        if (e.which === 13) {
            form.$submit();
        }
    };

    $scope.updateRow = function(obj) {
        var promise = {};
        var deferred = deferred || $q.defer();

        if(obj.status) {
            promise = $http.put('/api/prospects/'+obj.id, obj);
        } else if(obj.payRate) {
            promise = $http.put('/api/drivers/'+obj.id, obj);
        }

        promise.then(function(data) {
            deferred.resolve(data);
            setTimeout(function() { $state.forceReload(); }, 100);
        }, function(err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    $scope.deleteRow = function(obj) {
        var type = '';

        if(obj.payRate) {
            type = 'driver';
        } else if(obj.status) {
            type = 'prospect';
        } else {
            console.error('Failed to delete.', obj);
        }

        $http.delete('/api/' + type + 's/' + obj.id).then(function() {
            $state.forceReload();
        }, function(err) {
            console.error(err);
        });
    };

    $scope.getCarListElem = function() {
        return $q(function(resolve, reject) {
            resolve(angular.element('.car-list')[0]);
            reject(new Error('Failed to get car list element.'));
        });
    };

    $scope.getProspectListElems = function() {
        return $q(function(resolve, reject) {
            resolve(angular.element('.prospect-status'));
            reject(new Error('Failed to get list elements.'));
        });
    };

    $scope.getDriverListElems = function() {
        return $q(function(resolve, reject) {
            resolve(angular.element('.driver-list'));
            reject(new Error('Failed to get driver list elements.'));
        });
    };

    $scope.updateProspectStatus = function(id, newStatus) {
        $http.put('/api/prospects/' + id, {
            status: newStatus
        }).then(function() {
        }, function(err) {
            console.error(err);
        });
    };

    // Input: prospect with single name property
    // Output: prospect with three name properties less any property not needed for post method
    $scope.filterProspectData = function(id) {
        return $q(function(resolve, reject) {
            $modal.open({
                templateUrl: 'views/payRateModal.html',
                controller: 'PayRateModalInstanceCtrl'
            }).result.then(function(payRate) {
                
                var prospect = $filter('filter')($scope.prospects, function(data) {
                    return data.id === id;
                })[0];

                
                prospect.payRate = payRate;
                delete prospect.status;
                delete prospect.$$hashKey;
                delete prospect.createdAt;
                delete prospect.id;
                delete prospect.updatedAt;
                delete prospect.userId;

                resolve(prospect);
                reject(new Error('Failed to filter prospect data before promoting to driver.'));
                
            }, function(err) {
                console.error(err);
            });
        });
    };

    // Get id of car when a driver or prospect is sorted into it
    $scope.getCarId = function(eventItem) {
        return $q(function(resolve, reject) {
            resolve(parseInt(angular.element(eventItem).parent().data('carid')));
            reject(new Error('Failed to get car id for new driver.'));
        });
    };

    // Get the car a driver/prospect is reassigned/assigned to
    $scope.getCarInScope = function(id) {
        return $q(function(resolve, reject) {
            resolve($filter('filter')($scope.cars, function(car) {
                return car.id === id;
            })[0]);
            reject(new Error('Failed to extract car data for updating the scope.'));
        });
    };

    $scope.updateDriverAssignment = function(driverId, oldCar, newCar) {
        $http.put('/api/assignments/drivers/' + driverId, {
            oldCar: oldCar,
            newCar: newCar
        }).then(function(data) {
            console.log(data.data.msg);
        }, function(err) {
            console.error(err);
        });
    };

    // Makes lists sortable when all ng-repeats are finished
    $scope.$on('repeatFinished', function() {

        // NOT WORKING
        // remove default save and cancel buttons from xeditable row
        angular.element('.editable-buttons').remove();

        $scope.getProspectListElems().then(function(prospectListElems) {
            
            // Embue prospect objects with sortability across statuses and to car list
            [].forEach.call(prospectListElems, function(prospectListElem) {
                $scope.sortableConfigs.push(new Sortable(prospectListElem, {
                    group: 'prospects',
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
                                    $http.post('/api/drivers', prospect).then(function() {
                                        $http.delete('/api/prospects/'+id).then(function() {
                                            $state.forceReload();    // Temp fix for reloading the view so the UI is accurate
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
                    group: 'cars',
                    draggable: 'div.car',
                    handle: '.drag-handle-car',
                    animation: 150 
                }));

                // Embue driver objects with sortability across cars and to prospect list
                $scope.getDriverListElems().then(function(driverListElems) {
                    [].forEach.call(driverListElems, function(driverListElem) {
                        $scope.sortableConfigs.push(new Sortable(driverListElem, {
                            group: {
                                name: 'drivers',
                                put: ['prospects', 'drivers']
                            },
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
