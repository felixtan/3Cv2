'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarlogCtrl
 * @description
 * # CarlogCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarLogsCtrl', function (carHelpers, $state, dataService, $q, $scope, getCar) {
    $scope.car = getCar.data;
    $scope.dates = [];
    $scope.mostRecentLogDate = null;
    $scope.fields = [];
    $scope.tabs = [
        { title: 'Data', active: false, state: 'carProfile.data({ id: car.id })' },
        { title: 'Logs', active: true, state: 'carProfile.logs({ id: car.id })' }
    ];

    carHelpers.getLogDates().then(function(logDates) {
        $scope.dates = logDates;
        $scope.mostRecentLogDate = $scope.getMostRecentLogDate();
    });

    $scope.getMostRecentLogDate = function() {
        // assuming sorted from recent to past
        return $scope.dates[0];     
    }

    $scope.getFieldsToBeLogged = function(car) {
        var deffered = $q.defer();
        var fields = [];

        if(car) {
            for(var field in car.data) {
                if(car.data[field].log === true) fields.push(field);
            }
        }

        deffered.resolve(fields);
        deffered.reject(new Error('Error getting fields to be logged'));

        return deffered.promise;
    }

    $scope.getFieldsToBeLogged($scope.car).then(function(fields) {
        $scope.fields = fields;
    });

    $scope.updateMostRecentData = function() {
        var deferred = $q.defer();
        var mostRecentLog = _.find($scope.car.logs, function(log) { return log.weekOf === $scope.mostRecentLogDate });
     
        for(var field in mostRecentLog.data) {
            if(mostRecentLog.data[field] !== null && typeof mostRecentLog.data[field] !== 'undefined') 
                $scope.car.data[field].value = mostRecentLog.data[field];
        }

        deferred.resolve($scope.car);
        deferred.reject(new Error('Errror updating most recent log'));
        return deferred.promise;
    }

    // need to make this more efficient
    $scope.save = function(logDate) {
        if(logDate === $scope.mostRecentLogDate) {
            // update car.data is new value isn't null
            // update data if most recent log was changed
            $scope.updateMostRecentData().then(function(carWithUpdatedData) {
                dataService.updateCar(carWithUpdatedData);
            });
        }

        dataService.updateCar($scope.car);
    }
  });