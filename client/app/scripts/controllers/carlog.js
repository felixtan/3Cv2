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

    $scope.car = getCar.data;

    // $scope.activateTab($state);
    $scope.activateTab = function() {
        $scope.tabs[0].active = false;
        $scope.tabs[1].active = true;
    }
 

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

    $scope.getFieldsToBeLogged = function(car) {
        var deffered = $q.defer();
        var fields = [];

        for(var field in car.data) {
            if(car.data[field].log === true) fields.push(field);
        }

        deffered.resolve(fields);
        deffered.reject(new Error('Error getting fields to be logged'));

        return deffered.promise;
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

        dataService.updateCar($scope.car);
    }
  });