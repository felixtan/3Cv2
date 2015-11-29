'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarlogCtrl
 * @description
 * # CarlogCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarLogCtrl', function ($state, $filter, $window, dataService, $q, $scope, getCar) {

    // $scope.activateTab($state);
    $scope.activateTab = function() {
        $scope.tabs[0].active = false;
        $scope.tabs[1].active = true;
    }
    $scope.activateTab();

    // stores dates of log fors week starting/ending in milliseconds
    // store most recent date in a separate var just in case
    $scope.getLogDates = function() {
        var arr = [];
        _.each($scope.car.logs, function(log, index) {
            arr.push(log.weekOf);
        });
        
        $scope.dates = _.uniq(arr.sort(), true).reverse();
    }
    $scope.getLogDates();

    $scope.getMostRecentLogDate = function() {
        // assuming sorted from recent to past
        $scope.mostRecentLogDate = $scope.dates[0];     
    }
    $scope.getMostRecentLogDate();

    $scope.date = 0;

    var getFieldsToBeLogged = function(car) {
        return $q(function(resolve, reject) {
            var fields = [];
            for(var field in car.data) {
                if(car.data[field].log === true) fields.push(field);
            }

            resolve(fields);
            reject(new Error('Error getting fields to be logged'));
        });
    }

    // returns an object to be car.logs[i].data with keys (feilds) to be logged
    var newDataObj = function() {
        return $q(function(resolve, reject) {
            var data = {};
            // first car is taken because fields in car.data are assumed to be uniform for all cars
            getFieldsToBeLogged($scope.car).then(function(fields) {
                (function(field) {
                    data[field] = null;
                })(...fields);

                resolve(data);
                reject(new Error('Error creating log.data'));
            });
        });
    }

    // need to make this more efficient
    $scope.save = function(logDate) {
        if(logDate === $scope.mostRecentLogDate) {
            // update car.data is new value isn't null
            var mostRecentLog = _.find($scope.car.logs, function(log) { return log.weekOf === $scope.mostRecentLogDate });
            for(var field in mostRecentLog.data) {
                if(mostRecentLog.data[field] !== null && typeof mostRecentLog.data[field] !== 'undefined') $scope.car.data[field].value = mostRecentLog.data[field];
            }
        }

        dataService.updateCar($scope.car, { updateCarData: false });
    }
  });
