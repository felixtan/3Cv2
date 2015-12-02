'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarformmodalinstanceCtrl
 * @description
 * # CarformmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarFormModalInstanceCtrl', function (carHelpers, $q, ENV, $window, getCars, $state, dataService, $scope, $modalInstance) {

    // exposed vars
    var _ = $window._;
    $scope.newFieldsThisSession = [];   // store new fields created this session
    $scope.isCollapsed = true;

    // if there are cars, render fields in the car form
    // else only add field caperbilities
    $scope.thereAreCars = function() {
      return (typeof getCars.data[0] !== 'undefined');
    };

    $scope.cars = ($scope.thereAreCars()) ? (getCars.data) : [];
    
    (function () {
      $scope.logDates = [];
      if($scope.thereAreCars()) {
        carHelpers.getLogDates($scope.cars).then(function(logDates) {
          $scope.logDates = logDates;
          console.log('$scope.logDates:', $scope.logDates);
        });
      } 
    })();

    var initializeForm = function() {
      if($scope.thereAreCars()) {
        var car = getCars.data[0];
        var fields = Object.keys(car.data);
        $scope.formData = {};
        fields.forEach(function(field) {
          $scope.formData[field] = {
            value: null,
            log: car.data[field].log
          }
        });
      } else {
        $scope.formData = {};
      }
    };
    initializeForm();

    var setNewField = function() {
      $scope.newField = {
        name: null,
        type: null
      };  
    };
    setNewField();

    $scope.addField = function() {
      var newField = $scope.newField.name;
      $scope.newFieldsThisSession.push(newField);

      $scope.formData[newField] = {
        value: null,
        log: false
      }

      setNewField();

      if($scope.thereAreCars()) {
        // add field to other cars
        var cars = getCars.data;

        _.each(cars, function(car) {
          if(!(_.has(car, newField))) {

            // since log is set to false here, 
            // IMPORTANT to make sure it's updated 
            // for each car when carForm is submitted
            car.data[newField] = {
              log: false,
              value: null
            }

            dataService.updateCar(car, { updateCar: true });
          }
        });
      }
    };

    // pass in $scope.formData
    var newCar = function(carData) {
      return $q(function(resolve, reject) {
        var car = {};
        car.data = carData;
        car.logs = [];

        // check this in staging 
        if(ENV.name === ('production' || 'staging')) {
          car.organizationId = $scope.user.customData.organizationId;
        } else {
          car.organizationId = '3Qnv2pMAxLZqVdp7n8RZ0x';
        }

        resolve(car);
        reject(new Error('Error creating new car object'));
      });
    };

    $scope.submit = function () {
      var promise = newCar($scope.formData).then(carHelpers.populateLogs);
      promise.then(function(car) {
        dataService.createCar(car);
      });

      // check if log for any of the new fields was changed to true
      // if so, then update all other cars
      if($scope.newFieldsThisSession.length > 0) {
        _.each($scope.newFieldsThisSession, function(field) {
          if($scope.formData[field].log === true) {
            var cars = $scope.cars;
            
            _.each(cars, function(car) {
              
              if(typeof car.data[field] !== 'undefined') {
                car.data[field].log = true;
              } else {
                // something may have went wrong
                car.data[field] = {
                  log: true,
                  value: null
                }
              }

              dataService.updateCar(car, { updateCar: true });
            });
          }
        });
      }

      $scope.reset();
    };

    $scope.reset = function () {
      initializeForm();
      $state.forceReload();
    };

    $scope.close = function () {
      $state.forceReload();
      $modalInstance.dismiss('cancel');
    };
  });
