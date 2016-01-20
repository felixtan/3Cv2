'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProspectDataCtrl
 * @description
 * # ProspectDataCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ProspectDataCtrl', function ($q, $modal, $state, dataService, $scope, getProspect, getProspects, getProspectStatuses, prospectHelpers, driverHelpers) {
    
    $scope.prospect = getProspect.data;
    $scope.prospectStatuses = getProspectStatuses.data;
    $scope.statuses = $scope.prospectStatuses.statuses;
    $scope.fields = prospectHelpers.getFields($scope.prospect);

    ///////////////////
    ///// Data UI /////
    ///////////////////

    $scope.notStatus = function(field) {
        return (field.toLowerCase() != "status");
    };

    String.prototype.capitalizeIfStatus = function() {
        return (this === 'status') ? (this.charAt(0).toUpperCase() + this.slice(1)) : this;
    };

    $scope.notNameOrStatus = function(field) {
        return ((field != "First Name") && (field != "Last Name") && (field !== "fullName") && (field.toLowerCase() != "status"));
    };

    $scope.statusChanged = false;
    $scope.status = $scope.prospect.status.value;
    $scope.setStatusChanged = function(statusName) {
        var prospect = $scope.prospect;
        if((prospect.status.value != statusName) 
            || (prospect.data.status.value != statusName)
            && (typeof statusName !== 'undefined') 
            && (statusName !== null)) {
            $scope.statusChanged = true;
            $scope.status = statusName;
        }
    };

    // when status name changes
    $scope.updateStatus = function(prospect) {
        console.log(prospect);
        var deferred = $q.defer();
        prospect.status.value = $scope.status;
        prospect.data.status.value = $scope.status;
        deferred.resolve(prospect);
        deferred.reject(new Error("Error updating status of prospect" + prospect.id));
        return deferred.promise;
    };

    // all other fields
    $scope.updateFieldValue = function(value, field) {
        var prospect = $scope.prospect;
        if((prospect.data[field].value != value) 
            && (typeof value !== 'undefined') 
            && (value !== null)) {
            prospect.data[field].value = value;
            prospect.data[field].log = false;

            if((field == 'First Name') || (field == 'Last Name')) {
                prospect.data.fullName.value = prospect.data["First Name"].value + " " + prospect.data["Last Name"].value;
            }
            // console.log(prospect);
        }
    };

    $scope.fieldNameChanged = false;
    $scope.newFieldName = null;
    $scope.currentFieldName = null;
    $scope.setFieldNameChanged = function(newName, currentName) {
        $scope.newFieldName = newName;
        $scope.currentFieldName = currentName;
        if((newName !== null) 
            && (typeof newName !== 'undefined') 
            && (currentName !== null) 
            && (typeof currentName !== 'undefined') 
            && (currentName != newName)) {
            $scope.fieldNameChanged = true;
        }
    };

    $scope.updateFieldName = function(prospect) {
        var deferred = $q.defer();
        prospect.data[$scope.newFieldName] = prospect.data[$scope.currentFieldName];
        delete prospect.data[$scope.currentFieldName];
        deferred.resolve(prospect);
        deferred.reject(new Error('Error updating prospect field name, id: ' + prospect.id));
        return deferred.promise;
    };

    // pass in prospect and data.name
    $scope.updateProspectName = function(prospect) {
        var deferred = $q.defer();
        prospect.data.fullName.value = prospect.data["First Name"].value + " " + prospect.data["Last Name"].value;
        deferred.resolve(prospect);
        deferred.reject(new Error('Error updating driver fullName, id: ' + prospect.id));
        return deferred.promise;
    };

    // Update
    $scope.save = function (data, field) {
        // console.log(data);
        // console.log($scope.fieldNameChanged);
        // console.log($scope.statusChanged);

        var prospects = getProspects.data;

        if($scope.fieldNameChanged) {
            _.each(prospects, function(prospect) {
                $scope.updateFieldName(prospect).then(function(prospectWithUpdatedFieldName) {
                    // console.log(prospectWithUpdatedFieldName);
                    dataService.updateProspect(prospectWithUpdatedFieldName);    
                    // if(prospectWithUpdatedFieldName.id == $scope.prospect.id) $state.forceReload();
                    $state.forceReload();
                });
            });
        } else if($scope.statusChanged) {
            $scope.updateStatus($scope.prospect).then(function(prospectWithUpdatedStatus) {
                // console.log(prospectWithUpdatedStatus);
                dataService.updateProspect(prospectWithUpdatedStatus);
                $state.forceReload();
            });
        } else {
            $scope.updateProspectName($scope.prospect).then(function(prospectWithUpdatedName) {
                dataService.updateProspect(prospectWithUpdatedName);
                $state.forceReload();
            })
        }
    };

    $scope.getUniqueFieldName = function(fields, field) {
        return (_.contains(fields, field)) ? $scope.getUniqueFieldName(fields, "_" + field) : field;
    };

    // prospectData = $scope.prospect.data
    $scope.splitProspectData = function(driverData, prospectData, fieldsInCommon) {
        var deferred = $q.defer();
        var prospectDataMinusFieldsInCommon = {};
        var prospectDataOnlyFieldsInCommon = {};
        angular.copy(prospectData, prospectDataMinusFieldsInCommon);

        var prospectFieldsToAddToAllDrivers = _.difference(Object.keys(prospectData), Object.keys(driverData));
        // console.log(Object.keys(driverData));
        // console.log(Object.keys(prospectData));
        // console.log(prospectFieldsToAddToAllDrivers);

        prospectFieldsToAddToAllDrivers = _.reject(prospectFieldsToAddToAllDrivers, function(field) {
            return _.contains(Object.keys(driverData), field);
        });

        _.each(fieldsInCommon, function(field) {
            delete prospectDataMinusFieldsInCommon[field];
            prospectDataOnlyFieldsInCommon[field] = prospectData[field];
            if(prospectHelpers.notName(field)) {
                var renamedField = $scope.getUniqueFieldName(Object.keys(driverData), field);
                prospectFieldsToAddToAllDrivers.push(renamedField);
                prospectDataOnlyFieldsInCommon[renamedField] = prospectDataOnlyFieldsInCommon[field];
                delete prospectDataOnlyFieldsInCommon[field];
            }
        });

        deferred.resolve({
            prospectDataMinusFieldsInCommon: prospectDataMinusFieldsInCommon,
            prospectDataOnlyFieldsInCommon: prospectDataOnlyFieldsInCommon,
            prospectFieldsToAddToAllDrivers: _.without(prospectFieldsToAddToAllDrivers, "status")
        });

        deferred.reject(new Error('Error splitting prospect data via fields in common with driver data.'));
        return deferred.promise;
    };

    $scope.convert = function() {
        driverHelpers.getFormData().then(function(blankDriverData) {        
            var fieldsInCommon = _.intersection(Object.keys(blankDriverData), Object.keys($scope.prospect.data));
            $scope.splitProspectData(blankDriverData, $scope.prospect.data, fieldsInCommon).then(function(result) {
                // console.log(result.prospectFieldsToAddToAllDrivers);
                var newDriverData = _.extend(blankDriverData, result.prospectDataOnlyFieldsInCommon, result.prospectDataMinusFieldsInCommon);
                delete newDriverData.status;
                // console.log('newDriverData:', newDriverData);
                // console.log('add these fields to all drivers:', result.prospectFieldsToAddToAllDrivers);
                driverHelpers.createDriver(newDriverData).then(function(newDriverObj) {
                    // console.log('newDriverObj:', newDriverObj);
                    driverHelpers.saveDriver(newDriverObj).then(function(newDriver) {
                        // console.log(newDriver.data);
                        driverHelpers.getDrivers().then(function(promiseResult) {
                            var drivers = promiseResult.data;
                            _.each(drivers, function(driver) {
                                if(driver.id !== newDriver.data.id) {
                                    _.each(result.prospectFieldsToAddToAllDrivers, function(field) {
                                        driver.data[field] = { value: null, log: false };
                                    });
                                    // console.log(driver);
                                    driverHelpers.updateDriver(driver);
                                }
                            });
                        });
                            
                        prospectHelpers.deleteProspect($scope.prospect.id).then(function() {
                            $state.go('dashboard.prospects');
                        });
                    });
                });
            });
        });
    };

    // add field
    // Add field
    $scope.addField = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/addfieldmodal.html',
            controller: 'AddFieldModalInstanceCtrl',
            size: 'md',
            resolve: {
                getCars: function(dataService) {
                    return (($state.includes('carProfile') || $state.includes('dashboard.cars')) ? dataService.getCars() : {});
                },
                getDrivers: function(dataService) {
                    return (($state.includes('driverProfile') || $state.includes('dashboard.drivers')) ? dataService.getDrivers() : {});
                },
                getProspects: function(dataService) {
                    return (($state.includes('prospectProfile') || $state.includes('dashboard.prospects')) ? dataService.getProspects() : {});  
                },
                getAssets: function(dataService) {
                    return (($state.includes('assetProfile') || $state.includes('dashboard.assets')) ? dataService.getAssets() : {});
                },
                assetType: function() {
                    return null;
                }
            }
        });

        modalInstance.result.then(function (newField) {
            $scope.newField = newField;
            $state.forceReload();
        }, function() {
            $state.forceReload();
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });
