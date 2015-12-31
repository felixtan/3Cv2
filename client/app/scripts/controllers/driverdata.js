'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DriverdataCtrl
 * @description
 * # DriverdataCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DriverDataCtrl', function ($modal, $state, dataService, $scope, getDriver, getDrivers, carHelpers) {
    
    $scope.driver = getDriver.data;
    $scope.oldField = '';
    $scope.tabs = [
        { title: 'Data', route: 'driverProfile.data', active: true },
        { title: 'Logs', route: 'driverProfile.logs' }
    ];
    
    carHelpers.getIdentifier().then(function(identifier) {
        $scope.carIdentifier = identifier;
    });

    ///////////////////
    // Data UI ////////
    ///////////////////
    $scope.notName = function(field) {
        return ((field != "First Name") && (field != "Last Name") && (field !== "fullName"));
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

    /////////////////////////////
    // Car Assignment UI ////////
    /////////////////////////////
    $scope.assign = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/assignmentmodal.html',
            controller: 'AssignmentModalCtrl',
            size: 'md',
            resolve: {
                getCars: function(dataService) {
                    return dataService.getCars();
                },
                getDrivers: function(dataService) {
                    return {};
                },
                car: function(dataService) {
                    return {};
                },
                driver: function() {
                    return $scope.driver;
                }
            }
        });

        modalInstance.result.then(function (input) {
            console.log('passed back from AssignmentModalCtrl:', input);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });
