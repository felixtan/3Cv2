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

    $scope.updateDriverName = function(driver) {
        var deferred = $q.defer();
        driver.data.fullName.value = driver.data["First Name"].value + " " + driver.data["Last Name"].value;
        deferred.resolve(driver);
        deferred.reject(new Error('Error updating driver fullName, id: ' + driver.id));
        return deferred.promise;
    };

    $scope.save = function (data, field) {
        console.log('data:', data);
        var drivers = getDrivers.data;

        ///////////////////////////////
        /// Update the scope driver ///
        ///////////////////////////////

        // the scope driver's field value and log value are already changed,
        // so only need to check if field name changed
        // "First Name" and "Last Name" can't be changed so don't need to update fullName here
        // check it:
        // console.log('did it change?', $scope.driver);
        if($scope.fieldNameChanged()) {
            $scope.updateFieldName($scope.driver).then(function(driver) {
                dataService.updateDriver(driver);
                $state.forceReload();
            });
        } else {
            $scope.updateDriverName($scope.driver).then(function(driver) {
                dataService.updateDriver(driver);
                $state.forceReload();
            });
        }

        ///////////////////////////////
        //// Update other drivers /////
        ///////////////////////////////

        // To simplify things, update log val anyway handle both cases
        if($scope.fieldNameChanged()) {
            _.each(drivers, function(driver) {
                $scope.updateLogVal(driver).then(function(driverWithUpdatedLogVal) {
                    $scope.updateFieldName(driverWithUpdatedLogVal).then(function(driverWithUpdatedFieldName) {
                        dataService.updateDriver(driverWithUpdatedFieldName);
                    });
                });
            });
        } else if($scope.logValChanged() && !$scope.fieldNameChanged()) {
            _.each(drivers, function(driver) {
                $scope.updateLogVal(driver).then(function(driverWithUpdatedLogVal) {
                    dataService.updateDriver(driverWithUpdatedLogVal);
                });
            });
        } else {
            // do nothing
        }
        
        // if($scope.logValChanged()) console.log('log val changed');
        // if($scope.fieldValChanged()) {
        //     console.log('field val changed');
        //     if($scope.driverName(field)) console.log('driver name changed');
        // }
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
