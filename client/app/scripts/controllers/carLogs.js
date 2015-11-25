'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarstatuslogsCtrl
 * @description
 * # CarstatuslogsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarLogsCtrl', function ($filter, $window, dataService, $q, $scope, $state, $http, getAllCarLogs) {
    var _ = $window._;

    $scope.cars = getAllCarLogs.data;

    // stores dates of log fors week starting/ending in milliseconds
    // store most recent date in a separate var just in case
    $scope.getLogDates = function() {
        var arr = [];
        _.each($scope.cars, function(car, index) {
            _.each(car.logs, function(log, index) {
                arr.push(log.weekOf);
            });
        });
        
        $scope.dates = _.uniq(arr.sort(), true).reverse();
    }
    $scope.getLogDates();

    $scope.getMostRecentLogDate = function() {
        // return Math.max(...$scope.dates); -> assuming unsorted

        // assuming sorted from recent to past
        $scope.mostRecentLogDate = $scope.dates[0];     
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

    var getFieldsToBeLogged = function(car) {
        return $q(function(resolve, reject) {
            var fields = [];
            for(var field in car.data) {
                if(car.data[field].log === true) fields.push(field);
            }

            resolve(fields);
            reject(new Error('Error getting fields to be logged'));
        });
    }

    // returns an object to be car.logs[i].data with keys (feilds) to be logged
    var newDataObj = function() {
        return $q(function(resolve, reject) {
            var data = {};
            // first car is taken because fields in car.data are assumed to be uniform for all cars
            getFieldsToBeLogged($scope.cars[0]).then(function(fields) {
                (function(field) {
                    data[field] = null;
                })(...fields);

                resolve(data);
                reject(new Error('Error creating log.data'));
            });
        });
    }

    this.newLog = function() {
        // 1. show date picker
        // 2. user picks date -> store in log.date
        // 3. start of week -> stored in log.weekStarting
        // 4. create for all cars
        // employ loading animation 
        
        var d = $scope.dt;
        var weekOf = (new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)).getTime();

        if(!(_.contains($scope.dates, weekOf))) {
            // add new date to array of log dates
            $scope.dates.push(d.getTime());

            newDataObj().then(function(blankDataObj) {
                _.each($scope.cars, function(car) {            
                    car.logs.push({
                        createdAt: (new Date()),
                        weekOf: weekOf,
                        data: blankDataObj
                    });
                    
                    dataService.updateCar(car, { updateCarData: false });
                });
            });
        } else {
            alert('Log for ' + d.toDateString() + ' already exists!');
        }
    }

    // need to make this more efficient
    this.save = function(logDate) {
        _.each($scope.cars, function(car) {
            if(logDate === $scope.mostRecentLogDate) {
                // update car.data is new value isn't null
                var mostRecentLog = _.find(car.logs, function(log) { return log.weekOf === $scope.mostRecentLogDate });
                for(var field in mostRecentLog.data) {
                    if(mostRecentLog.data[field] !== null && typeof mostRecentLog.data[field] !== 'undefined') car.data[field].value = mostRecentLog.data[field];
                }
            }

            dataService.updateCar(car, { updateCarData: false });
        });
    }
  });
