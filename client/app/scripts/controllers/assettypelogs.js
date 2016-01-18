'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AssettypelogsCtrl
 * @description
 * # AssettypelogsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AssetTypeLogsCtrl', function (assetHelpers, $q, $scope, getAssets, getAssetTypes, $state) {
    
    $scope.tabs = [];
    $scope.assetTypes = getAssetTypes.data.types;
    $scope.assetType = null;

    _.each($scope.assetTypes, function(assetType) {
        var tab = { title: assetType.value, active: false };
        $scope.tabs.push(tab);
    });

    $scope.invalidAssetType = function() {
        return (($scope.assetType === null) || (typeof $scope.assetType === 'undefined'));
    };

    $scope.renderLogs = function(assetType) {
        // console.log(assetType);
        $scope.assetType = assetType;
        // console.log($scope.assetType);
        $scope.getAssets(assetType).then(function(assetsOfType) {
            console.log(assetsOfType);
            $scope.assets = assetsOfType;
            $scope.simpleAssets = assetHelpers.mapObject(assetsOfType);
            $scope.getLogDates(assetsOfType).then(function(logDates) {
                console.log(logDates);
                $scope.dates = logDates;
                $scope.getMostRecentLogDate();        
            });
        });
        // console.log($scope.assetType);
        // $state.forceReload();
    };

    $scope.getAssets = function(assetType) {
        var deferred = $q.defer();
        deferred.resolve(_.filter(getAssets.data, function(asset) {
            return asset.assetType === assetType;
        }));
        deferred.reject(new Error('Error getting ' + assetType + 's'));
        return deferred.promise;
        // console.log($scope.assets);
    };

    $scope.getLogDates = function(assets) {
        var deferred = $q.defer();
        var assetType = (assets.length) ? assets[0].assetType : '(There are no assets)';
        var arr = [];
        _.each(assets, function(asset, index) {
            _.each(asset.logs, function(log, index) {
                arr.push(log.weekOf);
            });
        });
        
        deferred.resolve(_.uniq(arr.sort(), true).reverse());
        deferred.reject(new Error('Error getting log dates for ' + assetType));
        return deferred.promise;
        // console.log($scope.dates);
    };

    $scope.getMostRecentLogDate = function() {
        $scope.mostRecentLogDate = $scope.dates[0];
    };

    $scope.createNewRow = function(date) {
        // add new date to array of log dates
        $scope.dates.push(date);
        $scope.getMostRecentLogDate();
        // $state.forceReload();
        $scope.renderLogs($scope.assetType);
    };

    $scope.newDataObj = function(assetType) {
        var deferred = $q.defer();
        var data = {};

        if($scope.assets.length > 0) {
            // first asset is taken because fields in asset.data are assumed to be uniform for all assets
            assetHelpers.getFieldsToBeLogged(assetType).then(function(fields) {
                // Turn this into modal?
                console.log(fields);

                if(fields.length === 0) {
                    deferred.resolve({});
                } else {
                     _.each(fields, function(field) {
                        data[field] = null;
                    });

                    deferred.resolve(data);
                }
            });    
        } else {
            deferred.reject(new Error('There are no assets for logging!'));
        }
        
        return deferred.promise;
    };

    $scope.createLogForAsset = function(asset, date, data) {
        var deferred = $q.defer();
        asset.logs.push({
            createdAt: (new Date()),
            weekOf: date,
            data: data
        });
        deferred.resolve(asset);
        deferred.reject(new Error('Error creating log for asset ' + asset.id));
        return deferred.promise;
    };

    $scope.newLog = function(assetType) {
        var d = $scope.dt;
        var weekOf = (new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)).getTime();
        console.log(assetType);
        var promise = $scope.newDataObj(assetType).then(function(blankDataObj) {
            console.log(blankDataObj);
            _.each($scope.assets, function(asset) {
                $scope.createLogForAsset(asset, weekOf, blankDataObj).then(assetHelpers.updateAsset);
            });
        });

        if(!(_.contains($scope.dates, weekOf))) {
            $q.all([promise]).then(function(values) {
                $scope.createNewRow(weekOf);
            }).catch(function(err) {
                console.error(err);
            });
        } else {
            alert('Log for ' + d.toDateString() + ' already exists!');
        }
    };

    $scope.getMostRecentLog = function(assetLogs, logDate) {
        var deferred = $q.defer();
        var mostRecentLog = _.find(assetLogs, function(log) {
            return log.weekOf === logDate;
        });

        deferred.resolve(mostRecentLog);
        deferred.reject(new Error('Error getting most revent log for asset'));
        return deferred.promise;
    };

    $scope.save = function(logDate) {
        _.each($scope.assets, function(asset) {
            $scope.getMostRecentLog(asset.logs, logDate).then(function(mostRecentLog) {
                for(var field in mostRecentLog.data) {
                    if((mostRecentLog.data[field] !== null) && (typeof mostRecentLog.data[field] !== 'undefined')) {
                        asset.data[field].value = mostRecentLog.data[field];
                        assetHelpers.updateAsset(asset);
                        $scope.simpleAssets = assetHelpers.mapObject($scope.assets);
                    }
                }
            });
        });
    };

    // Datepicker
    // error when using const and 'use strict'
    var oneWeekInMs = 604800000;
    var oneDayInMs = 86400000;

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 0
    };

    $scope.getStartingDayNum = function() {
        return $scope.dateOptions.startingDay;
    }

    $scope.getStartingDayWord = function() {
        switch($scope.getStartingDayNum()) {
            case 0:
                return 'Sunday';
                break;
            case 1:
                return 'Monday';
                break;
            default:
                return 'Invalid day';
        }
    }

    // @param day is of type int from 0-1 (Sunday/Monday)
    $scope.setStartingDay = function(day) {
        if((day < 0) || (day > 1)) alert('Invalid day');
        $scope.dateOptions.startingDay = day;
    }

    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    // Allows for a year in advance
    $scope.maxDate = new Date($scope.dt.getFullYear()+1, $scope.dt.getMonth()+1);

    $scope.open = function($event) {
        $scope.status.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.status = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
  
    $scope.events = 
    [
            {
                date: tomorrow,
                status: 'full'
            },
        {
            date: afterTomorrow,
            status: 'partially'
        }
    ];

    $scope.getDayClass = function(date, mode) {
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i=0;i<$scope.events.length;i++){
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    };
    // End datepicker stuff

  });
