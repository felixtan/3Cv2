'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DriverlogsCtrl
 * @description
 * # DriverlogsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DriverLogsCtrl', function (dataService, $q, $scope, getDrivers, $state) {
    $scope.getDrivers = function() {
        $scope.drivers = getDrivers.data;
    }
    $scope.getDrivers();

    // stores dates of log fors week starting/ending in milliseconds
    // store most recent date in a separate var just in case
    $scope.getLogDates = function() {
        var arr = [];
        $scope.dates = [];
        _.each($scope.drivers, function(driver, index) {
            _.each(driver.logs, function(log, index) {
                arr.push(log.weekOf);
            });
        });
        
        $scope.dates = _.uniq(arr.sort(), true).reverse();
    }
    $scope.getLogDates();

    $scope.getMostRecentLogDate = function() {
        // return Math.max(...$scope.dates); -> assuming unsorted

        // assuming sorted from recent to past
        if($scope.dates.length > 0) $scope.mostRecentLogDate = $scope.dates[0];     
    }
    $scope.getMostRecentLogDate();

    $scope.date = 0;

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

    $scope.getFieldsToBeLogged = function(driver) {
        var deferred = $q.defer();
        var fields = [];
        for(var field in driver.data) {
            if(driver.data[field].log === true) fields.push(field);
        }
        
        deferred.resolve(fields);
        deferred.reject(new Error('Error getting fields to be logged'));
        return deferred.promise;
    }

    // returns an object to be driver.logs[i].data with keys (feilds) to be logged
    $scope.newDataObj = function() {
        var deferred = $q.defer();
        var data = {};
        // first driver is taken because fields in driver.data are assumed to be uniform for all drivers
        $scope.getFieldsToBeLogged($scope.drivers[0]).then(function(fields) {
            // Turn this into modal?
            if(fields.length === 0) {
                deferred.reject(new Error('There are no fields to be logged!'));
            }

            _.each(fields, function(field) {
                data[field] = null;
            });
        });

        deferred.resolve(data);
        deferred.reject(new Error('Error creating log.data'));
        return deferred.promise;
    }

    $scope.createLogForDriver = function(driver, date, data) {
        var deferred = $q.defer();
        driver.logs.push({
            createdAt: (new Date()),
            weekOf: date,
            data: data
        });
        deferred.resolve(driver);
        deferred.reject(new Error('Error creating log for driver ' + driver.id));
        return deferred.promise;
    };

    $scope.newLog = function() {
        var d = $scope.dt;
        var weekOf = (new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)).getTime();

        var promise = $scope.newDataObj().then(function(blankDataObj) {
            _.each($scope.drivers, function(driver) {
                $scope.createLogForDriver(driver, weekOf, blankDataObj).then(dataService.updateDriver);
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
    }

    // call if log with mostRecentLogDate was updated
    // in order to keep data up to date

    // need to make this more efficient
    $scope.save = function(logDate) {
        _.each($scope.drivers, function(driver) {
            if(logDate === $scope.mostRecentLogDate) {
                // update driver.data is new value isn't null
                var mostRecentLog = _.find(driver.logs, function(log) { return log.weekOf === $scope.mostRecentLogDate });
                for(var field in mostRecentLog.data) {
                    if(mostRecentLog.data[field] !== null && typeof mostRecentLog.data[field] !== 'undefined') driver.data[field].value = mostRecentLog.data[field];
                }
            }

            dataService.updateDriver(driver);
        });
    };
    
    $scope.createNewRow = function(date) {
        // add new date to array of log dates
        $scope.dates.push(date);
        $scope.getMostRecentLogDate();
        $state.forceReload();
    };
  });
