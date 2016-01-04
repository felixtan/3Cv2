'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DriverdataCtrl
 * @description
 * # DriverdataCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DriverDataCtrl', function ($q, $modal, $state, dataService, $scope, getDriver, getDrivers, carHelpers) {
    
    $scope.driver = getDriver.data;
    $scope.tabs = [
        { title: 'Data', active: true, state: 'driverProfile.data({ id: driver.id })' },
        { title: 'Logs', active: false, state: 'driverProfile.logs({ id: driver.id })' }
    ];
    
    carHelpers.getIdentifier().then(function(identifier) {
        $scope.carIdentifier = identifier;
    });

    ///////////////////
    ///// Data UI /////
    ///////////////////

    $scope.notName = function(field) {
        return ((field != "First Name") && (field != "Last Name") && (field !== "fullName"));
    };

    $scope.getFields = function(driver) {
        $scope.fields = Object.keys($scope.driver.data);
        return $scope.fields;
    };
    $scope.getFields();

    $scope.newFieldName = null;
    $scope.currentFieldName = null;
    $scope.checkFieldName = function(newName, currentName) {
        $scope.newFieldName = newName;
        $scope.currentFieldName = currentName;
    };

    $scope.fieldNameChanged = function() {
        if(($scope.newFieldName !== null) 
            && (typeof $scope.newFieldName !== 'undefined') 
            && ($scope.currentFieldName !== null) 
            && (typeof $scope.currentFieldName !== 'undefined') 
            && ($scope.currentFieldName !== $scope.newFieldName)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.newFieldVal = null;
    $scope.currentFieldVal = null;
    $scope.checkFieldValue = function(newVal, currentVal) {
        $scope.newFieldVal = newVal;
        $scope.currentFieldVal = currentVal;
    };

    $scope.fieldValChanged = function() {
        if(($scope.newFieldVal !== null) 
            && (typeof $scope.newFieldVal !== 'undefined') 
            && ($scope.currentFieldVal !== null) 
            && (typeof $scope.currentFieldVal !== 'undefined') 
            && ($scope.currentFieldVal !== $scope.newFieldVal)) { 
            return true;
        } else {
            return false;
        }
    };

    // can't use this because since "First Name" and "Last Name"
    // are locked from the editable row
    $scope.driverName = function(field) {
        return ((field == 'First Name') || (field == 'Last Name')) ? true : false;
    };
    
    $scope.currentLogVal = null;
    $scope.newLogVal = null;
    $scope.checkLogValue = function(newVal, currentVal) {
        $scope.currentLogVal = currentVal;
        $scope.newLogVal = newVal;
    };

    $scope.logValChanged = function() {
        if(($scope.newLogVal !== null) 
            && (typeof $scope.newLogVal !== 'undefined') 
            && ($scope.currentLogVal !== null) 
            && (typeof $scope.currentLogVal !== 'undefined') 
            && ($scope.currentLogVal !== $scope.newLogVal)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.updateFieldName = function(driver) {
        var deferred = $q.defer();
        driver.data[$scope.newFieldName] = driver.data[$scope.currentFieldName];
        delete driver.data[$scope.currentFieldName];
        deferred.resolve(driver);
        deferred.reject(new Error('Error updating driver field name, id: ' + driver.id));
        return deferred.promise;
    };

    $scope.updateLogVal = function(driver) {
        var deferred = $q.defer();
        driver.data[$scope.currentFieldName].log = $scope.newLogVal;
        deferred.resolve(driver);
        deferred.reject(new Error('Error updating field log value'));
        return deferred.promise;
    };

    // pass in driver and data.name
    $scope.updateDriverName = function(driver) {
        var deferred = $q.defer();
        driver.data.fullName.value = driver.data["First Name"].value + " " + driver.data["Last Name"].value;
        deferred.resolve(driver);
        deferred.reject(new Error('Error updating driver fullName, id: ' + driver.id));
        return deferred.promise;
    };

    $scope.addFieldToLogs = function(driver, field) {
        var deferred = $q.defer();
        _.each(driver.logs, function(log) {
            log.data[field] = null;    
        });
        deferred.resolve(driver);
        deferred.reject(new Error('Error adding field to all logs'));
        return deferred.promise;
    };

    $scope.save = function (data, field) {
        // console.log('data:', data);
            // data.name -> updated field name
            // data.value -> updated field value
            // data.log -> updated field log

        var drivers = getDrivers.data;

        // the scope driver's field value and log value are already changed,
        // so only need to check if field name changed
        // "First Name" and "Last Name" can't be changed so don't need to update fullName here
        // check it:
        // console.log('did it change?', $scope.driver);
       
        if($scope.fieldNameChanged() && !$scope.logValChanged()) {
            _.each(drivers, function(driver) {
                $scope.updateFieldName(driver).then(function(driverWithUpdatedFieldName) {
                    // console.log('saving:', driverWithUpdatedFieldName);
                    dataService.updateDriver(driverWithUpdatedFieldName);
                    if(driverWithUpdatedFieldName.id == $scope.driver.id) $state.forceReload();
                });
            });
        } else if($scope.logValChanged() && !$scope.fieldNameChanged()) {
            _.each(drivers, function(driver) {
                $scope.updateLogVal(driver).then(function(driverWithUpdatedLogVal) {
                    $scope.addFieldToLogs(driverWithUpdatedLogVal, data.name).then(function(driverWithUpdatedLogs) {
                        // console.log('saving:', driverWithUpdatedLogs);
                        dataService.updateDriver(driverWithUpdatedLogs);
                        if(driverWithUpdatedLogs.id == $scope.driver.id) $state.forceReload();
                    });
                });
            });
        } else if($scope.logValChanged() && $scope.fieldNameChanged()) {
            _.each(drivers, function(driver) {
               $scope.updateLogVal(driver).then(function(driverWithUpdatedLogVal) {
                    $scope.addFieldToLogs(driverWithUpdatedLogVal, data.name).then(function(driverWithUpdatedLogs) {
                        $scope.updateFieldName(driverWithUpdatedLogs).then(function(driverWithUpdatedFieldName) {
                            // console.log('saving:', driverWithUpdatedFieldName);
                            dataService.updateDriver(driverWithUpdatedFieldName);
                            if(driverWithUpdatedFieldName.id == $scope.driver.id) $state.forceReload();
                        });
                    });
                });
            });
        } else {
            $scope.updateDriverName($scope.driver).then(function(driver) {
                dataService.updateDriver(driver);
                $state.forceReload();
            });
        }
    };

    /////////////////////////////
    ///// Car Assignment UI /////
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
