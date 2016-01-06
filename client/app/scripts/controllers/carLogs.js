'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarstatuslogsCtrl
 * @description
 * # CarstatuslogsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarLogsCtrl', function (carHelpers, dataService, $q, $scope, getCars, $state) {

    $scope.getCars = function() {
        $scope.cars = getCars.data;
        $scope.identifier = $scope.cars[0].identifier || null;
        $scope.simpleCars = carHelpers.mapObject($scope.cars, $scope.identifier);
    }
    $scope.getCars();

    // stores dates of log fors week starting/ending in milliseconds
    // store most recent date in a separate var just in case
    $scope.getLogDates = function() {
        var arr = [];
        $scope.dates = [];
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
        
        var d = $scope.dt;
        var weekOf = (new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)).getTime();

        var promise = $scope.newDataObj().then(function(blankDataObj) {
            _.each($scope.cars, function(car) {
                $scope.createLogForCar(car, weekOf, blankDataObj).then(dataService.updateCar);
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
        $state.forceReload();
        $state.forceReload();
    };
  });
