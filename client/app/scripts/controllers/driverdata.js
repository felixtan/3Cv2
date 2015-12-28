'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DriverdataCtrl
 * @description
 * # DriverdataCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DriverDataCtrl', function ($state, dataService, $scope, getDriver, getDrivers) {
    
    $scope.driver = getDriver.data;
    $scope.oldField = '';
    $scope.tabs = [
        { title: 'Data', route: 'driverProfile.data', active: true },
        { title: 'Logs', route: 'driverProfile.logs' }
    ];

    $scope.notName = function(field) {
        return ((field != "First Name") && (field != "Last Name"));
    };

    $scope.getFields = function(driver) {
        $scope.fields = Object.keys($scope.driver.data);
        return $scope.fields;
    };
    $scope.getFields();

    $scope.nameChanged = function(newVal, oldVal) {
        $scope.oldField = oldVal;
    };

    // Update
    $scope.save = function (data) {
        var newField = data.name;
        $scope.drivers = getDrivers.data;
        var logVal = data.log;

        // update current driver
        (function() {
            delete $scope.driver.data[$scope.oldField];
            $scope.driver.data[newField] = { value: data.value, log: data.log };
            dataService.updateDriver($scope.driver);
        })();

        $scope.drivers.forEach(function(driver) {
            if(driver.id !== $scope.driver.id) {
                var value = driver.data[$scope.oldField].value;
                driver.data[newField] = { value: value, log: logVal };
                if ($scope.oldField !== newField) delete driver.data[$scope.oldField];
                dataService.updateDriver(driver);
            }
        });
    };
  });
