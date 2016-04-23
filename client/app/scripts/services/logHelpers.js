'use strict';

angular.module('clientApp')
    .factory('logHelpers', function ($q, dataService, ENV, $window) {

        var _ = $window._;

        function isValid (value) {
            return value !== null && typeof value !== "undefined";
        }

        function getLogDates (objects) {
            var deferred = $q.defer(),
                logDates = [];

            if(isValid(objects)) {
                if(objects.length > 0) {
                    _.each(objects, function(object) {
                        _.each(object.logs, function(log) {
                            logDates.push(log.weekOf);
                            logDates = _.uniq(logDates.sort(), true).reverse();
                        });
                    });
                } else {
                    deferred.resolve(logDates);
                    deferred.reject(new Error('Error getting log dates'));
                }
            } else {
                deferred.resolve(logDates);
                deferred.reject(new Error('Error getting log dates'));
            }

            return deferred.promise;
        }

        function createLog (data, weekOf) {
            return $q(function(resolve, reject) {
                var log = {};
                log.data = data;
                log.createdAt = (new Date());
                log.weekOf = weekOf;

                resolve(log);
                reject(new Error('Error creating blank log object'));
            });
        }

        function createLogs (logDates, blankLogData) {
            var deferred = $q.defer(),
                logs = [];

            _.each(logDates, function(logDate) {
                logs.push({
                    data: blankLogData,
                    weekOf: logDate,
                    createdAt: new Date()
                });
            });

            deferred.resolve(logs);
            deferred.reject(new Error("Error creating blank logs array"));
            return deferred.promise;
        }

        function getFieldsToBeLogged (objects) {
            var deferred = $q.defer(),
                fields = [];

            if(isValid(objects)) {
                if(objects.length > 0) {
                    fields = _.filter(Object.keys(object[0].data), function(field) {
                        return objects[0].data[field].log;
                    });
                } else {
                    deferred.resolve(fields);
                    deferred.reject(new Error('Error getting fields to be logged'));
                }
            } else {
                deferred.resolve(fields);
                deferred.reject(new Error('Error getting fields to be logged'));
            }
            
            return deferred.promise;
        }

        function createLogData (objects) {
            var deferred = $q.defer(),
                logData = {};

            getFieldsToBeLogged(objects).then(function(fields) {
                // console.log(fields);
                _.each(fields, function(field) {
                    logData[field] = null;
                });

                deferred.resolve(logData);
                deferred.reject(new Error('Error creating log data'));
            });

            return deferred.promise;
        }

        return {
            getLogDates: getLogDates,
        };

    });