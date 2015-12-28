'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DriverformmodalinstanceCtrl
 * @description
 * # DriverformmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DriverFormModalInstanceCtrl', function (driverHelpers, $state, ENV, $q, dataService, getDrivers, $scope, $modalInstance, $modal) {
    
    $scope.newFieldsThisSession = [];   // store new fields created this session
    $scope.drivers = getDrivers.data;

    $scope.thereAreDrivers = function() {
      return (typeof $scope.drivers[0] !== 'undefined');
    };
    
    $scope.getFields = function () {
      $scope.fields = [];
      if($scope.thereAreDrivers()) {
        var driver = $scope.drivers[0];
        $scope.fields = Object.keys(driver.data);
      }
    };
    $scope.getFields();

    $scope.notName = function(field) {
      return ((field != "First Name") && (field != "Last Name"));
    };

    $scope.nameEntered = function() {
      return (($scope.formData["First Name"].value !== null) && ($scope.formData["Last Name"].value !== null));
    };

    $scope.initializeForm = function() {
      $scope.formData = {
        "First Name": {
          value: null,
          log: false
        },
        "Last Name": {
          value: null,
          log: false
        }
      };
      
      if($scope.drivers.length > 0) {
        var driver = $scope.drivers[0];
        $scope.fields = Object.keys(driver.data);
        _.each($scope.fields, function(field) {
          if($scope.notName(field)) {
            $scope.formData[field] = {
              value: null,
              log: driver.data[field].log
            }
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
      };

      $scope.setNewField();

      if($scope.thereAreDrivers()) {
        // add field to other drivers
        var drivers = $scope.drivers;

        _.each(drivers, function(driver) {
          if(!(_.has(driver.data, newField))) {
            // since log is set to false here, 
            // IMPORTANT to make sure it's updated 
            // for each driver when driverForm is submitted
            driver.data[newField] = {
              log: false,
              value: null
            }

            dataService.updateDriver(driver);
          }
        });
      }
    };

    // pass in $scope.formData
    $scope.newDriver = function(driverData) {
      var deferred = $q.defer();
      var driver = {
        data: driverData,
        logs: [],
        organizationId: (ENV.name === ('production' || 'staging')) ? $scope.user.customData.organizationId : '3Qnv2pMAxLZqVdp7n8RZ0x'
      };
      
      deferred.resolve(driver);
      deferred.reject(new Error('Error creating new driver object'));
      return deferred.promise;
    };

    $scope.submit = function () {
      var promise = $scope.newDriver($scope.formData).then(driverHelpers.populateLogs);
      promise.then(function(driver) {
        dataService.createDriver(driver).then(function(newDriver) {
          $scope.drivers.push(newDriver.data);
        });
      });

      // check if log for any of the new fields was changed to true
      // if so, then update all other drivers
      if($scope.newFieldsThisSession.length > 0) {
        _.each($scope.newFieldsThisSession, function(field) {
          if(($scope.formData[field].log === true) && (typeof $scope.formData[field] !== 'undefined')) {
            var drivers = $scope.drivers;
            
            _.each(drivers, function(driver) {
              
              if(typeof driver.data[field] !== 'undefined') {
                driver.data[field].log = true;
              } 

              dataService.updateDriver(driver);
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
                getDrivers: function(dataService) {
                    return dataService.getDrivers();
                },
                getCars: function() { return {}; }
            }
        });

        modalInstance.result.then(function (field) {
            if(typeof field !== 'undefined') delete $scope.formData[field];
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });
