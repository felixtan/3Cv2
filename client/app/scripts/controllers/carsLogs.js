'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarstatuslogsCtrl
 * @description
 * # CarstatuslogsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarsLogsCtrl', function (datepicker, carHelpers, dataService, $q, $scope, getCars, $state) {

    $scope.datepicker = datepicker;
    $scope.cars = getCars.data;
    $scope.identifier = $scope.cars[0].identifier || null;
    $scope.simpleCars = carHelpers.mapObject($scope.cars, $scope.identifier);
    $scope.dates = [];

    // stores dates of log fors week starting/ending in milliseconds
    // store most recent date in a separate var just in case
    $scope.getLogDates = function() {
        var deferred = $q.defer();
        var arr = [];
        _.each($scope.cars, function(car, index) {
            _.each(car.logs, function(log, index) {
                arr.push(log.weekOf);
            });
        });
        
        deferred.resolve(_.uniq(arr.sort(), true).reverse());
        deferred.reject(new Error('Error getting existing log dates'));
        return deferred.promise;
    }
    
    $scope.getLogDates().then(function(dates) {
        $scope.dates = dates;
    });

    $scope.getMostRecentLogDate = function() {
        // return Math.max(...$scope.dates); -> assuming unsorted

        // assuming sorted from recent to past
        if($scope.dates.length > 0) $scope.mostRecentLogDate = $scope.dates[0];     
    }
    $scope.getMostRecentLogDate();

    $scope.getFieldsToBeLogged = function(car) {
        var deferred = $q.defer();
        var fields = [];
        for(var field in car.data) {
            if(car.data[field].log === true) fields.push(field);
        }
        
        deferred.resolve(fields);
        deferred.reject(new Error('Error getting fields to be logged'));
        return deferred.promise;
    }

    // returns an object to be car.logs[i].data with keys (feilds) to be logged
    $scope.newDataObj = function() {
        var deferred = $q.defer();
        var data = {};
        // first car is taken because fields in car.data are assumed to be uniform for all cars
        $scope.getFieldsToBeLogged($scope.cars[0]).then(function(fields) {
            _.each(fields, function(field) {
                data[field] = null;
            });
        });

        deferred.resolve(data);
        deferred.reject(new Error('Error creating log.data'));
        return deferred.promise;
    }

    $scope.createLogForCar = function(car, date, data) {
        var deferred = $q.defer();
        car.logs.push({
            createdAt: (new Date()),
            weekOf: date,
            data: data
        });
        deferred.resolve(car);
        deferred.reject(new Error('Error creating log for car ' + car.id));
        return deferred.promise;
    };

    $scope.newLog = function() {
        // 1. show date picker
        // 2. user picks date -> store in log.date
        // 3. start of week -> stored in log.weekStarting
        // 4. create for all cars
        // employ loading animation 
        
        var d = $scope.datepicker.dt;
        var weekOf = (new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)).getTime();

        var promise = $scope.newDataObj().then(function(blankDataObj) {
            _.each($scope.cars, function(car) {
                $scope.createLogForCar(car, weekOf, blankDataObj).then(dataService.updateCar);
            });
        });

        if(!(_.contains($scope.dates, weekOf))) {
            $q.all([promise]).then(function(values) {
                $scope.createNewRow(weekOf);
                $state.forceReload();
            }).catch(function(err) {
                console.error(err);
            });
        } else {
            alert('Log for ' + d.toDateString() + ' already exists!');
        }
    }

    // need to make this more efficient
    $scope.save = function(logDate) {
        _.each($scope.cars, function(car) {
            if(logDate === $scope.mostRecentLogDate) {
                // update car.data is new value isn't null
                var mostRecentLog = _.find(car.logs, function(log) { return log.weekOf === $scope.mostRecentLogDate });
                for(var field in mostRecentLog.data) {
                    if(mostRecentLog.data[field] !== null && typeof mostRecentLog.data[field] !== 'undefined') car.data[field].value = mostRecentLog.data[field];
                }
            }

            dataService.updateCar(car);
        });
    };

    $scope.createNewRow = function(date) {
        // add new date to array of log dates
        $scope.dates.push(date);
    };
  });
