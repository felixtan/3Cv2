'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarstatuslogsCtrl
 * @description
 * # CarstatuslogsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarLogsCtrl', function ($scope, $state, $http, getAllCarLogs) {
    this.cars = getAllCarLogs.data;
    // this.mostRecentDateInMs = getCarLogs.data.mostRecentDateInMs;

    // stores dates of log fors week starting/ending
    // store most recent date in a separate var just in case
    this.dates = [];

    // error when using const and 'use strict'
    var oneWeekInMs = 604800000;

    // Datepicker
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
  $scope.maxDate = new Date(2020, 5, 22);

  $scope.open = function($event) {
    $scope.status.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
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

    
    this.newLog = function() {
        // 1. show date picker
        // 2. user picks date -> store in log.date
        // 3. start of week -> stored in log.weekStarting
        // 4. create for all cars
        // employ loading animation 

        var newDateInMs = this.mostRecentDateInMs + oneWeekInMs;
        var date = new Date(newDateInMs);

        $http.post('/api/logs/maintenance', {
            date: date,
            dateInMs: newDateInMs
        }).then(function() {
            setTimeout(function() { $state.forceReload(); }, 1000);
        }).catch(function(err) {
            console.error(err);
        });
    };

    this.updateLog = function(carLog) {
        $http.put('/api/logs/cars/' + carLog.id, {
            mileage: carLog.mileage,
            note: carLog.note
        }).success(function() {
        }).error(function(err) {
            console.error(err);
        });
    };

  });
