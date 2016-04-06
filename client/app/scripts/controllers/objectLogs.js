'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarlogCtrl
 * @description
 * # CarlogCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ObjectLogsCtrl', function (objectType, objectId, carHelpers, driverHelpers, prospectHelpers, assetHelpers, $state, $q, $scope) {
    
    var ctrl = this;
    $scope.objectType = objectType;
    $scope.logDataObj = {};

    ctrl.getObject = function () {
        if($scope.objectType === 'car') {
            $scope.update = carHelpers.update;
            $scope.state = {
                data: 'carData({ id: object.id })',
                logs: 'carLogs({ id: object.id })',
            };
            return carHelpers.getById;
        } else if($scope.objectType === 'driver') {
            $scope.update = driverHelpers.update;
            $scope.state = {
                data: 'driverData({ id: object.id })',
                logs: 'driverLogs({ id: object.id })',
            };
            return driverHelpers.getById;
        } else if($scope.objectType === 'prospect') {
            $scope.update = prospectHelpers.update;
            $scope.state = {
                data: 'prospectData({ id: object.id })',
                logs: null,
            };
            return prospectHelpers.getById;
        } else if($scope.objectType === 'asset') {
            $scope.update = assetHelpers.update;
            $scope.state = {
                data: 'assetData({ id: object.id })',
                logs: 'assetLogs({ id: object.id })',
            };
            return assetHelpers.getById;
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

    ctrl.getObject()(objectId).then(function(result) {
        $scope.object = result.data;
        $scope.identifierValue = $scope.object.data[$scope.object.identifier].value;
        $scope.assetType = $scope.object.assetType || null;
        $scope.tabs = [
            { title: 'Data', active: false, state: $scope.state.data },
            { title: 'Logs', active: true, state: $scope.state.logs }
        ];

        ctrl.getLogDates()($scope.assetType).then(function(dates) {
            $scope.dates = dates;
            $scope.mostRecentLogDate = $scope.getMostRecentLogDate();
            $scope.getFieldsToBeLogged($scope.object).then(function(fields) {
                $scope.fields = fields;
                $scope.logDataToArray();
            });
        });
    });

    /*
        It needs to look something like this

        For each log (by weekOf) in logs
            For each data in log (by weekOf)
                For each field in fields
                    return {
                        weekOf: [
                            { field: field, value: value }
                            .
                            .
                        ],
                        .
                        .
                        .
                    }
    */
    $scope.getLogDataByDate = function (date) {
        // console.log(date);
        return $scope.logDataObj[date];
    };

    $scope.notExpressionField = function (type) {
        // console.log(type);
        // console.log(type !== "function" && type !== 'inequality');
        return type !== "function" && type !== 'inequality';
    };

    $scope.logDataToArray = function () {
        _.each($scope.dates, function(date) {
            // console.log(date);
            var log = _.findWhere($scope.object.logs, { weekOf: date });
            // console.log(log);
            var a = []

            _.each($scope.fields, function(loggedField) {
                // console.log(loggedField);
                a.push({
                    field: loggedField,
                    value: log.data[loggedField],
                    type: $scope.object.data[loggedField].type
                });
            });
            // console.log(a);
            // console.log($scope.logDataObj);
            $scope.logDataObj[date] = a;
            // console.log($scope.logDataObj);
        });
        
        // deferred.resolve(b);
        // deferred.reject(new Error("Error converting log data to array"));
        // return deferred.promise;
    };

    $scope.getMostRecentLogDate = function() {
        // assuming sorted from recent to past
        return $scope.dates[0];     
    }

    $scope.getFieldsToBeLogged = function(object) {
        var deffered = $q.defer();
        var fields = [];

        if(object) {
            for(var field in object.data) {
                if(object.data[field].log === true) fields.push(field);
            }
        }

        deffered.resolve(fields);
        deffered.reject(new Error('Error getting fields to be logged'));

        return deffered.promise;
    }

    
    // setInterval(function() { }, 1000);

    $scope.updateMostRecentData = function() {
        var deferred = $q.defer();
        var mostRecentLog = _.find($scope.object.logs, function(log) { return log.weekOf === $scope.mostRecentLogDate });
     
        for(var field in mostRecentLog.data) {
            if(mostRecentLog.data[field] !== null && typeof mostRecentLog.data[field] !== 'undefined') 
                $scope.object.data[field].value = mostRecentLog.data[field];
        }

        deferred.resolve($scope.object);
        deferred.reject(new Error('Errror updating most recent log'));
        return deferred.promise;
    }

    // need to make this more efficient
    $scope.save = function(logDate) {
        if(logDate === $scope.mostRecentLogDate) {
            console.log('most recent updated');
            // update object.data is new value isn't null
            // update data if most recent log was changed
            $scope.updateMostRecentData().then(function(objectWithUpdatedData) {
                $scope.update(objectWithUpdatedData);
            });
        }

        $scope.update($scope.object);
    }
  });