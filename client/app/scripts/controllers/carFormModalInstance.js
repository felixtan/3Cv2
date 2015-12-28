'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CarformmodalinstanceCtrl
 * @description
 * # CarformmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CarFormModalInstanceCtrl', function (carHelpers, $q, ENV, getCars, $state, dataService, $scope, $modalInstance, $modal) {
    
    $scope.newFieldsThisSession = [];   // store new fields created this session
    $scope.cars = getCars.data;

    // if there are cars, render fields in the car form
    // else only add field caperbilities
    $scope.thereAreCars = function() {
      return (typeof $scope.cars[0] !== 'undefined');
    };

    // get $scope.fields (old fields)
    $scope.getFields = function () {
      $scope.fields = [];
      if($scope.thereAreCars()) {
        var car = $scope.cars[0];
        $scope.fields = Object.keys(car.data);
      }
    };
    $scope.getFields();

    $scope.initializeForm = function() {
      $scope.formData = {};
      
      if($scope.cars.length > 0) {
        var car = $scope.cars[0];
        $scope.fields = Object.keys(car.data);
        _.each($scope.fields, function(field) {
          $scope.formData[field] = {
            value: null,
            log: car.data[field].log
          }
        });
      }
    };
    $scope.initializeForm();

    $scope.setNewField = function() {
      $scope.newField = {
        name: null,
        type: null
      };  
    };
    $scope.setNewField();

    $scope.addField = function() {
      var newField = $scope.newField.name;
      $scope.newFieldsThisSession.push(newField);

      $scope.formData[newField] = {
        value: null,
        log: false
      }

      $scope.setNewField();

      if($scope.thereAreCars()) {
        // add field to other cars
        var cars = $scope.cars;

        _.each(cars, function(car) {
          if(!(_.has(car.data, newField))) {
            // since log is set to false here, 
            // IMPORTANT to make sure it's updated 
            // for each car when carForm is submitted
            car.data[newField] = {
              log: false,
              value: null
            }

            dataService.updateCar(car);
          }
        });
      }
    };

    // pass in $scope.formData
    $scope.newCar = function(carData) {
      var deferred = $q.defer();
      var car = {
        data: carData,
        logs: [],
        organizationId: (ENV.name === ('production' || 'staging')) ? $scope.user.customData.organizationId : '3Qnv2pMAxLZqVdp7n8RZ0x'
      };

      deferred.resolve(car);
      deferred.reject(new Error('Error creating new car object'));
      return deferred.promise;
    };

    $scope.submit = function () {
      var promise = $scope.newCar($scope.formData).then(carHelpers.populateLogs);
      promise.then(function(car) {
        dataService.createCar(car).then(function(newCar) {
          $scope.cars.push(newCar.data);
        });
      });

      // check if log for any of the new fields was changed to true
      // if so, then update all other cars
      if($scope.newFieldsThisSession.length > 0) {
        _.each($scope.newFieldsThisSession, function(field) {
          if(($scope.formData[field].log === true) && (typeof $scope.formData[field] !== 'undefined')) {
            var cars = $scope.cars;
            
            _.each(cars, function(car) {
              
              if(typeof car.data[field] !== 'undefined') {
                car.data[field].log = true;
              } 

              dataService.updateCar(car);
            });
          }
        });
      }

      $scope.reset();
    };

    $scope.reset = function () {
      $scope.initializeForm();
    };

    $scope.close = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.openDeleteFieldModal = function (size, thing) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/deletefieldmodal.html',
            controller: 'DeleteFieldModalInstanceCtrl',
            size: size,
            resolve: {
                thing: function() {
                    return thing;   // object { type: x, value: y } such that x ∈ ['field', 'log'] and y ∈ $scope.fields or $scope.dates
                },
                getCars: function(dataService) {
                    return dataService.getCars();
                },
                getDrivers: function() { return {}; }
            }
        });

        modalInstance.result.then(function (field) {
            if(typeof field !== 'undefined') delete $scope.formData[field];
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });
