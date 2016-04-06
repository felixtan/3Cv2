'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarstatuslogsCtrl
 * @description
 * # CarstatuslogsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ObjectsLogsCtrl', function (objectType, objectHelpers, datepicker, carHelpers, driverHelpers, prospectHelpers, assetHelpers, $q, $scope, $state) {

    var ctrl = this;
    $scope.objectType = objectType;
    $scope.datepicker = datepicker;

    ctrl.getObjects = function () {
        if($scope.objectType === 'car') {
            $scope.title = 'Car';
            $scope.state = { logs: 'carData({ id: object.id })' };
            $scope.update = carHelpers.update;
            return carHelpers.get;
        } else if($scope.objectType === 'driver') {
            $scope.title = 'Driver';
            $scope.state = { logs: 'driverData({ id: object.id })' };
            $scope.update = driverHelpers.update;
            return driverHelpers.get;
        } else if($scope.objectType === 'prospect') {
            $scope.title = 'Prospect';
            $scope.state = null;
            $scope.update = prospectHelpers.update;
            return prospectHelpers.get;
        } else if($scope.objectType === 'asset') {
            $scope.title = 'Asset';
            $scope.state = { logs: 'assetData({ id: object.id })' };
            $scope.update = assetHelpers.update;
            return assetHelpers.get;
        }
    };

    ctrl.getLogDates = function () {
        if($scope.objectType === 'car') {
            return carHelpers.getLogDates;
        } else if($scope.objectType === 'driver') {
            return driverHelpers.getLogDates;
        } else if($scope.objectType === 'prospect') {
            return function () {};
        } else if($scope.objectType === 'asset') {
            return assetHelpers.getLogDates;
        }
    };

    ctrl.getObjects()().then(function(result) {
        $scope.objects = result.data;
        $scope.identifier = $scope.objects[0].identifier || null;
        $scope.assetType = $scope.objects[0].assetType || null;
        $scope.simpleObjects = objectHelpers.simplify($scope.objects);

        ctrl.getLogDates()($scope.assetType).then(function(dates) {
            $scope.dates = dates;
            $scope.getMostRecentLogDate();
        });
    });

    
    $scope.getMostRecentLogDate = function() {
        // return Math.max(...$scope.dates); -> assuming unsorted

        // assuming sorted from recent to past
        if($scope.dates.length > 0) {
            $scope.mostRecentLogDate = $scope.dates[0];    
        } else {
            $scope.mostRecentLogDate = null;
        }
    };

    $scope.getFieldsToBeLogged = function(object) {
        var deferred = $q.defer();
        var fields = [];
        for(var field in object.data) {
            if(object.data[field].log === true) fields.push(field);
        }
        
        deferred.resolve(fields);
        deferred.reject(new Error('Error getting fields to be logged'));
        return deferred.promise;
    }

    // returns an object to be object.logs[i].data with keys (feilds) to be logged
    $scope.newDataObj = function() {
        var deferred = $q.defer();
        var data = {};
        // first object is taken because fields in object.data are assumed to be uniform for all objects
        $scope.getFieldsToBeLogged($scope.objects[0]).then(function(fields) {
            _.each(fields, function(field) {
                data[field] = null;
            });
        });

        deferred.resolve(data);
        deferred.reject(new Error('Error creating log.data'));
        return deferred.promise;
    }

    $scope.createLogForCar = function(object, date, data) {
        var deferred = $q.defer();
        object.logs.push({
            createdAt: (new Date()),
            weekOf: date,
            data: data
        });
        deferred.resolve(object);
        deferred.reject(new Error('Error creating log for object ' + object.id));
        return deferred.promise;
    };

    $scope.newLog = function() {
        // 1. show date picker
        // 2. user picks date -> store in log.date
        // 3. start of week -> stored in log.weekStarting
        // 4. create for all objects
        // employ loading animation 
        
        var d = $scope.datepicker.dt;
        var weekOf = (new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)).getTime();

        var promise = $scope.newDataObj().then(function(blankDataObj) {
            _.each($scope.objects, function(object) {
                $scope.createLogForCar(object, weekOf, blankDataObj).then($scope.update);
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

    $scope.notExpressionField = function (field) {
        var type = $scope.objects[0].data[field].type;
        // console.log(type);
        // console.log(type !== "function" && type !== 'inequality');
        return type !== "function" && type !== 'inequality';
    };

    // need to make this more efficient
    $scope.save = function(logDate) {
        _.each($scope.objects, function(object) {
            if(logDate === $scope.mostRecentLogDate) {
                // update object.data is new value isn't null
                var mostRecentLog = _.find(object.logs, function(log) { return log.weekOf === $scope.mostRecentLogDate });
                for(var field in mostRecentLog.data) {
                    if(mostRecentLog.data[field] !== null && typeof mostRecentLog.data[field] !== 'undefined') object.data[field].value = mostRecentLog.data[field];
                }
            }

            $scope.update(object);
        });
    };

    $scope.createNewRow = function(date) {
        // add new date to array of log dates
        $scope.dates.push(date);
    };
  });
