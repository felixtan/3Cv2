'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DriverlogCtrl
 * @description
 * # DriverlogCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DriverLogCtrl', function ($q, $scope, getDriver, dataService) {
    $scope.driver = getDriver.data;
    $scope.tabs = [
        { title: 'Data', active: false, state: 'driverProfile.data({ id: driver.id })' },
        { title: 'Logs', active: true, state: 'driverProfile.logs({ id: driver.id })' }
    ];

    $scope.getFieldsToBeLogged = function() {
        $scope.fieldsToBeLogged = [];
        if((typeof $scope.driver !== 'undefined') && ($scope.driver !== null)) {
            var fields = Object.keys($scope.driver.data);
            _.each(fields, function(field) {
                if($scope.driver.data[field].log === true) {
                    $scope.fieldsToBeLogged.push(field);
                }
            });
        }
    };
    $scope.getFieldsToBeLogged();

    // stores dates of log fors week starting/ending in milliseconds
    // store most recent date in a separate var just in case
    $scope.getLogDates = function() {
        var arr = [];
        _.each($scope.driver.logs, function(log, index) {
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

    // need to make this more efficient
    $scope.save = function(logDate) {
        if(logDate === $scope.mostRecentLogDate) {
            // update driver.data is new value isn't null
            var mostRecentLog = _.find($scope.driver.logs, function(log) { return log.weekOf === $scope.mostRecentLogDate });
            for(var field in mostRecentLog.data) {
                if(mostRecentLog.data[field] !== null && typeof mostRecentLog.data[field] !== 'undefined') $scope.driver.data[field].value = mostRecentLog.data[field];
            }
        }

        dataService.updateDriver($scope.driver);
    }
  });
