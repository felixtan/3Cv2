'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AssigncarmodalCtrl
 * @description
 * # AssigncarmodalCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AssignmentModalCtrl', function ($q, $scope, getCars, getDrivers, car, driver, dataService, $modalInstance, $state) {
    
    $scope.objIdentifier = null;   // get this from settings
    $scope.formData = {};
    $scope.subject = {};
    $scope.subjectType = null;
    $scope.objectType = null;
    $scope.simpleObjects = [];
    $scope.fullObjects = [];
    $scope.updateObj = function(object) { return; };
    $scope.updateSubj = function(subject) { return; };

    // returns array of simpler objects with id, and identifier value
    $scope.mapObject = function(objects, identifier) {
        return _.map(objects, function(object) {
            return {
                id: object.id,
                identifierValue: object.data[identifier].value
            };
        });
    };

    if($state.includes("driverProfile")) {
        console.log("assignment modal called from driverProfile");
        $scope.subject = driver;
        $scope.subjectType = 'driver';
        $scope.objectType = 'car';
        $scope.updateSubj = dataService.updateDriver;
        $scope.updateObj = dataService.updateCar;
        $scope.subjIdentifier = "First Name";
        $scope.objIdentifier = "licensePlate";
        $scope.fullObjects = getCars.data;
        $scope.simpleObjects = $scope.mapObject($scope.fullObjects, $scope.objIdentifier);
    } else if($state.includes("carProfile")) {
        console.log("assignment modal called from carProfile");
        $scope.subject = car;
        $scope.subjectType = 'car';
        $scope.objectType = 'driver';
        $scope.updateSubj = dataService.updateCar;
        $scope.updateObj = dataService.updateDriver;
        $scope.subjIdentifier = "licensePlate";
        $scope.objIdentifier = "First Name";
        $scope.fullObjects = getDrivers.data;
        $scope.simpleObjects = $scope.mapObject($scope.fullObjects, $scope.objIdentifier);
    } else {
        console.log('assignment modal called from invalid state', $state.current);
    }

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

    $scope.validForm = function() {
        return (($scope.formData.objId === null) || (typeof $scope.formData.objId === "undefined"));
    };

    $scope.reset = function () {
      $scope.formData = {};
      $scope.form.$setPristine();
      $scope.form.$setUntouched();
      $state.forceReload();
    };

    $scope.close = function () {
        $state.forceReload();
        $modalInstance.dismiss('ok');
    };

    $scope.getObjectIdentifierValue = function(id) {
        var deferred = $q.defer();
        var obj = _.find($scope.simpleObjects, function(obj) {
            return obj.id == id;
        });

        deferred.resolve(obj.identifierValue);
        deferred.reject('Failed to get identifier value');
        return deferred.promise;
    };

    $scope.assignSubjectToObject = function() {
        var subject = {
            id: $scope.subject.id,
            identifier: {
                name: $scope.subjIdentifier,
                value: $scope.subject.data[$scope.subjIdentifier].value
            },
            dateAssigned: $scope.dt.getTime(),
            dateUnassigned: null
        };

        var obj = _.find($scope.fullObjects, function(object) {
            return object.id == $scope.formData.objId;
        });

        // console.log('assigning', subject);
        // console.log('to:', obj);

        if($scope.objectType === 'driver') {
            obj.carsAssigned.push(subject);
        } else if($scope.objectType === 'car') {
            obj.driversAssigned.push(subject);
        } else {
            console.log('Invalid assignment operation', {
                subject: $scope.subjectType,
                objects: $scope.objectType
            });
        }

        $scope.updateObj(obj);
    };

    // Assign object to subject
    $scope.submit = function() {

        $scope.getObjectIdentifierValue($scope.formData.objId).then(function(identifierValue) {
            var object = {
                id: parseInt($scope.formData.objId),
                identifier: {
                    name: $scope.objIdentifier,
                    value: identifierValue
                },
                dateAssigned: $scope.dt.getTime(),
                dateUnassigned: null
            };

            // console.log('assigning', object);
            // console.log('to:', $scope.subject);
            
            if($scope.subjectType === 'driver') {
                $scope.subject.carsAssigned.push(object);
                $scope.updateSubj($scope.subject);
            } else if($scope.subjectType === 'car') {
                $scope.subject.driversAssigned.push(object);
                $scope.updateSubj($scope.subject);
            } else {
                console.log('Invalid assignment operation', {
                    subject: $scope.subjectType,
                    objects: $scope.objectType
                });
            }

            $scope.assignSubjectToObject();
            $scope.close();
        });
    };
  });
