'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AssetlogCtrl
 * @description
 * # AssetlogCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AssetLogsCtrl', function ($state, dataService, $q, $scope, getAsset) {
    $scope.asset = getAsset.data;

    $scope.tabs = [
        { title: 'Data', active: false, state: 'assetProfile.data({ type: asset.assetType, id: asset.id })' },
        { title: 'Logs', active: true, state: 'assetProfile.logs({ type: asset.assetType, id: asset.id })' }
    ];

    // stores dates of log fors week starting/ending in milliseconds
    // store most recent date in a separate var just in case
    $scope.getLogDates = function() {
        var arr = [];
        _.each($scope.asset.logs, function(log, index) {
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

    $scope.getFieldsToBeLogged = function(asset) {
        var deffered = $q.defer();
        var fields = [];

        for(var field in asset.data) {
            if(asset.data[field].log === true) fields.push(field);
        }

        deffered.resolve(fields);
        deffered.reject(new Error('Error getting fields to be logged'));

        return deffered.promise;
    }

    // need to make this more efficient
    $scope.save = function(logDate) {
        if(logDate === $scope.mostRecentLogDate) {
            // update asset.data is new value isn't null
            var mostRecentLog = _.find($scope.asset.logs, function(log) { return log.weekOf === $scope.mostRecentLogDate });
            for(var field in mostRecentLog.data) {
                if(mostRecentLog.data[field] !== null && typeof mostRecentLog.data[field] !== 'undefined') $scope.asset.data[field].value = mostRecentLog.data[field];
            }
        }

        dataService.updateAsset($scope.asset);
    }
  });