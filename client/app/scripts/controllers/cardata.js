'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CardataCtrl
 * @description
 * # CardataCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarDataCtrl', function ($state, $filter, $window, dataService, $q, $scope, getCar, getCars) {

    var _ = $window._;

    $scope.car = getCar.data;
    
    $scope.getFields = function() {
        $scope.fields = _.keys($scope.car.data);
        return $scope.fields;
    }
    $scope.getFields();

    // Implement CRUD operations for car data

    // Delete
    // handled by DeleteFieldModalCtrl

    // remember that added fields, updated fields, deleted fields, and logged fields must apply to all cars

    // Create
    // handled by AddFieldModalCtrl

    var renameField = function(oldFieldName, newFieldName, car) {
        return $q(function(resolve, reject) {
            var value = car.data[oldFieldName];
            car.data[newFieldName] = {
                value: value.value,
                log: value.log
            }
            delete car.data[oldFieldName];

            resolve(car);
            reject(new Error('Failed to change car field name'));
        });
    }

    var changeLogValue = function(field, car) {
        return $q(function(resolve, reject) {
            car.data[field].log = !car.data[field].log;

            resolve(car);
            reject(new Error('Failed to change field log value'));
        });
    }

    // Update
    $scope.save = function (data, id) {
        var field = angular.element('#' + data.name).attr('once-attr-field');
        var cars = getCars.data;
        console.log('old:',field);
        console.log('new:',data.name);
        if(data.name !== field)  {   
            renameField(field, data.name, $scope.car).then(function(currentCar) {
                // field name and log val should be updated
                dataService.updateCar(currentCar, { updateCar: true });
                console.log('current car:', currentCar);

                // _.each(cars, function(car) {
                //     if(car.id !== id) {
                //         changeLogValue(field, car).then(function(car) {
                //             renameField(field, data.name, car).then(function(car) {
                //                 dataService.updateCar(car, { updateCar: true });
                //                 console.log('other cars:',car);
                //             });
                //         });
                //     }
                // });
            });
        } else {
            dataService.updateCar($scope.car, { updateCar: true });
            console.log(car);
            _.each(cars, function(car) {
                changeLogValue(data.name, car).then(function(car) {
                    console.log(car);
                    dataService.updateCar(car, { updateCar: true });
                });
            });
        }

        // 2. if field or log changed, change the other cars too

        // field name has changed
        // for each car create new object with the new field name
        // delete the old field
        // if(data.name !== field) {   
        //     var cars = getCars.data;
        //     _.each(cars, function(car) {
        //         var value = car.data[field];
        //         car.data[data.name] = value;
        //         delete car.data[field];
        //         console.log('with new field name:', car);
        //         // dataService.updateCar(car, { updateCar: true });
        //     });
        // }

        // THIS SHOULD HAPPEN BEFORE FIELD NAME CHANGE
        // log boolean value has changed
        // for each car change car.data[field].log
        // if(data.log !== $scope.car.data[field].log) {
        //     var cars = getCars.data;
        //     _.each(cars, function(car) {
        //         car.data[field].log = data.log;
        //         console.log('with log value changed:', car);
        //     });
        // }

        // change the value
        // console.log('car after change:',$scope.car);

        // var toUpdate = Object.keys(datasChanged);

        // if only value is changed, then only update car where car.id === id
        // if((fields.length === 1) && (fields[0] === 'value')) dataService.updateCar($scope.car, { updateCarData: true });

        // // if 'log' is in fields, then update call cars data
        // if(_.contains(fields, 'name')) {
        //     $scope.cars = getCars.data;
        //     _.each($scope.cars, function(car) {
        //         if((_.contains(fields, 'value')) && (car.id === id)) car.data[datasChanged['name']].value = datasChanged['value'];
        //         car.data[datasChanged['name']].log = datasChanged['log'];
        //         dataService.updateCar(car, { updateCarData: true });
        //     });
        // } 

        // if 'value' is in fields, then update only cars of id
        
    }

  });
