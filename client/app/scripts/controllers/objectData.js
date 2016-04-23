'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CardataCtrl
 * @description
 * # CardataCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ObjectDataCtrl', function ($window, objectType, objectId, objectHelpers, assetHelpers, prospectHelpers, driverHelpers, carHelpers, $q, $state, $scope, $modal) {   
    
    var _ = $window._,
        ctrl = this;        // for testing;
    // ctrl.assetType = { value: null };
    $scope.objectType = objectType;
    $scope.carIdentifier = null;

    $scope.valid = function (thing) {
        return thing !== null && typeof thing !== "undefined";
    };

    ctrl.getObject = function () {
        if($scope.objectType === 'car') {
            $scope.state = {
                data: 'carData({ id: object.id })',
                logs: 'carLogs({ id: object.id })',
            };
            return carHelpers.getById;
        } else if($scope.objectType === 'driver') {
            $scope.state = {
                data: 'driverData({ id: object.id })',
                logs: 'driverLogs({ id: object.id })',
            };
            // console.log($scope.state);
            carHelpers.getIdentifier().then(function(identifier) {
                $scope.carIdentifier = identifier;
            });

            return driverHelpers.getById;
        } else if($scope.objectType === 'prospect') {
            $scope.state = {
                data: 'prospectData({ id: object.id })',
                logs: null,
            };
            return prospectHelpers.getById;
        } else if($scope.objectType === 'asset') {
            $scope.state = {
                data: 'assetData({ id: object.id })',
                logs: 'assetLogs({ id: object.id })',
            };
            return assetHelpers.getById;
        }
    };

    ctrl.getObjects = function () {
        if($scope.objectType === 'car') {
            return carHelpers.get;
        } else if($scope.objectType === 'driver') {
            return driverHelpers.get;
        } else if($scope.objectType === 'prospect') {
            return prospectHelpers.get;
        } else if($scope.objectType === 'asset') {
            return assetHelpers.getByType;
        }
    };

    ctrl.getObject()(objectId).then(function(result1) {
        // console.log(result1);
        if(typeof result1 !== 'undefined') {
            $scope.object = result1.data;
        }

        ctrl.assetType = $scope.object.assetType;
        $scope.identifierValue = $scope.object.data[$scope.object.identifier].value;

        $scope.tabs = [
            { title: 'Data', active: true, state: $scope.state.data },
            { title: 'Logs', active: false, state: $scope.state.logs }
        ];

        ctrl.getObjects()($scope.object.assetType).then(function(result2) {
            // console.log(result2);
            ctrl.objects = result2.data;
        });
    });

    // Add field
    $scope.addField = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/addfieldmodal.html',
            controller: 'AddFieldModalInstanceCtrl',
            size: 'md',
            resolve: {
                getCars: function() {
                    return $scope.objectType === 'car' ? ctrl.objects : {};
                },
                getDrivers: function() {
                    return $scope.objectType === 'driver' ? ctrl.objects : {};
                },
                getProspects: function() {
                    return $scope.objectType === 'prospect' ? ctrl.objects : {};  
                },
                getAssets: function() {
                    return $scope.objectType === 'asset' ? ctrl.objects : {};
                },
                assetType: function() {
                    return $scope.objectType === 'asset' ? ctrl.assetType : null;
                },
                objectType: function() {
                    return $scope.objectType;
                }
            }
        });

        modalInstance.result.then(function () {
            $state.forceReload();
        }, function() {
            $state.forceReload();
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    /////////////////////////////
    // Driver Assignment UI /////
    /////////////////////////////

    $scope.assign = function (thing) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/assignmentmodal.html',
            controller: 'AssignmentModalCtrl',
            size: 'md',
            resolve: {
                getDrivers: function() {
                    return $scope.objectType === 'car' ? driverHelpers.get : null;
                },
                getCars: function() {
                    return $scope.objectType === 'driver' ? carHelpers.get : null;
                },
                driver: function() {
                    return $scope.objectType === 'driver' ? $scope.object : null;
                },
                car: function() {
                    return $scope.objectType === 'car' ? $scope.object : null;
                },
                subjectType: function() {
                    return $scope.objectType;
                },
                objectType: function() {
                    return thing;
                },
                getAssetTypes: function() {
                    return $scope.objectType === 'driver' ? assetHelpers.getAssetTypes : null;
                },
                getAssets: function() {
                    return $scope.objectType === 'driver' ? assetHelpers.getAssets : null;
                },
                asset: function() {
                    return $scope.objectType === 'asset' ? driverHelpers.get : null;
                },
            }
        });

        modalInstance.result.then(function (input) {
            console.log('passed back from AssignmentModalCtrl:', input);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $scope.editField = function(object, field) {
        // console.log(object);
        // console.log(field);
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/editFieldModal.html',
            controller: 'EditFieldModalCtrl',
            size: 'md',
            resolve: {
                field: function() {
                    return field;
                },
                _object: function() {
                    return object;
                },
                objectType: function() {
                    return $scope.objectType;
                },
                getCars: function() {
                    // console.log(ctrl.objects);
                    return $scope.objectType === 'car' ? ctrl.objects : [];
                },
                getProspects: function() {
                    return $scope.objectType === 'prospect' ? ctrl.objects : [];
                },
                getDrivers: function() {
                    return $scope.objectType === 'driver' ? ctrl.objects : [];
                },
                getAssets: function() {
                    return $scope.objectType === 'asset' ? ctrl.objects : [];
                }
            }
        });

        modalInstance.result.then(function () {
            // console.log('passed back from EditFieldModalCtrl:', input);
            $state.forceReload();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
            $state.forceReload();
        });
    };

    //
    // Prospect data stuff
    /////////////////////////////////////////////////
    $scope.notName = function(field) {
        // console.log(field);
        return ($scope.objectType === "prospect" || $scope.objectType === 'driver') && field === "Name" || field === 'assetType';
    };

    $scope.notStatus = function(field) {
        return (field.toLowerCase() !== "status");
    };

    String.prototype.capitalizeIfStatus = function() {
        return (this === 'status' && $scope.objectType === "prospect") ? (this.charAt(0).toUpperCase() + this.slice(1)) : this;
    };

    $scope.notNameOrStatus = function(field) {
        return ((field !== "First Name") && (field !== "Last Name") && (field !== "Name") && (field.toLowerCase() !== "status"));
    };

    // used in convert?
    ctrl.getUniqueFieldName = function(fields, field) {
        return (_.contains(fields, field)) ? ctrl.getUniqueFieldName(fields, "~" + field) : field;
    };

    ctrl.getFieldsInCommon = function (prospectData, driverData) {
        var deferred = $q.defer(),
            p = Object.keys(prospectData).length,
            d = Object.keys(driverData).length,
            fieldsInCommon = [];

            // console.log(p);
            // console.log(d);
        if(p <= d) {
            _.each(prospectData, function(data, field) {
                if(typeof driverData[field] !== 'undefined') {
                    if(driverData[field].type === data.type) {
                        fieldsInCommon.push(field);
                    }
                }
            });
        } else {
            _.each(driverData, function(data, field) {
                if(typeof prospectData[field] !== 'undefined') {
                    if(prospectData[field].type === data.type) {
                        fieldsInCommon.push(field);
                    }
                }
            });
        }

        deferred.resolve(fieldsInCommon);   // array of fields in common checked by name and type
        deferred.reject(new Error("Error getting fields in common between driver and prospect"));
        return deferred.promise;
    };

    ctrl.partitionFields = function (prospectData, driverData) {
        var deferred = $q.defer();

        ctrl.getFieldsInCommon(prospectData, driverData).then(function(fieldsInCommon) {
            var pFields = Object.keys(prospectData),
                dFields = Object.keys(driverData),
                uniqueToP = [],
                uniqueToD = [];

            uniqueToP = _.difference(pFields, fieldsInCommon);
            uniqueToD = _.difference(dFields, fieldsInCommon);

            deferred.resolve({
                uniqueToProspect: _.without(uniqueToP, 'status'),
                uniqueToDriver: uniqueToD,
                inCommon: fieldsInCommon,
            });
            deferred.reject(new Error("Error partitioning driver and prospect fields"));
        });

        return deferred.promise;
    };

    /*
        Changes the name of prospect fields if they conflict with names of driver fields
    */
    ctrl.resolveNameConflicts = function (partedFields, prospectData) {
        var deferred = $q.defer();
        
        _.each(partedFields.uniqueToProspect, function(field) {
            var temp = ctrl.getUniqueFieldName(partedFields.uniqueToDriver, field);
            
            if (temp !== field) {
                partedFields.uniqueToProspect[_.indexOf(partedFields.uniqueToProspect, field)] = temp;
                prospectData[temp] = prospectData[field];
                delete prospectData[field];    
                objectHelpers.updateExpressionFieldsIfFieldNameChanged(field, temp, prospectData).then(function(prospectDataWithUpdatedExpressions) {
                    prospectData = prospectDataWithUpdatedExpressions;
                });
            }
        });

        deferred.resolve({
            partedFields: partedFields,
            prospectData: prospectData,
        });
        deferred.reject(new Error("Error changing prospect field names"));
        return deferred.promise;
    };

    // Adds unique prospect fields to all drivers, renaming if necessary
    // Returns data of first updated driver
    ctrl.addProspectFieldsToExistingDrivers = function (fieldsUniqueToProspect, prospectData) {
        var deferred = $q.defer(),
            fields = fieldsUniqueToProspect;

        // console.log(fields);
        // console.log(prospectData);

        driverHelpers.get().then(function(result) {
            var drivers = result.data;
            // console.log(drivers);
            if(typeof drivers !== 'undefined' && drivers !== null) {
                if(drivers.length > 0) {
                    _.each(drivers, function(driver, index) {
                        // console.log(driver);
                        // console.log(index);
                        // console.log(list);

                        _.each(fields, function(field) {
                            driver.data[field] = {
                                value: null,
                                log: false,
                                type: prospectData[field].type,
                                dataType: prospectData[field].dataType,
                                expression: (prospectData[field].type === 'function') ? prospectData[field].expression : undefined,
                                expressionItems: prospectData[field].type === 'function' ? prospectData[field].expressionItems : undefined,
                                leftExpressionItems: prospectData[field].type === 'inequality' ? prospectData[field].leftExpressionItems : undefined,
                                rightExpressionItems: prospectData[field].type === 'inequality' ? prospectData[field].rightExpressionItems : undefined,
                                inequalitySignId: prospectData[field].type === 'inequality' ? prospectData[field].inequalitySignId : undefined,
                                inequalitySign: prospectData[field].type === 'inequality' ? prospectData[field].inequalitySign : undefined,
                                leftExpression: prospectData[field].type === 'inequality' ? prospectData[field].leftExpression : undefined,
                                rightExpression: prospectData[field].type === 'inequality' ? prospectData[field].rightExpression : undefined,
                            };

                            if (driver.data.status) {
                                delete driver.data.status;
                            }

                            // Runs regardless of whether fieldsUniqueToProspect >= 0
                            driverHelpers.update(driver).then(function(result) {
                                if(index === 0) {
                                    // console.log(result.config.data.data);
                                    deferred.resolve(result.config.data.data);
                                    deferred.reject(new Error("Error getting updated driver data after adding prospect fields"));
                                }
                            });
                        });
                    });
                } else {
                    deferred.resolve(prospectData);
                    deferred.reject(new Error("Error getting updated driver data after adding prospect fields"));
                }
            } else {
                deferred.resolve(prospectData);
                deferred.reject(new Error("Error getting updated driver data after adding prospect fields"));
            }
        });

        return deferred.promise;
    };

    ctrl.buildNewDriverData = function(prospectData, partedFields) {
        var deferred = $q.defer();
        // console.log(driverData);
        _.each(prospectData, function(data, field) {
            // var temp = field.replace(/~/g, "");
            // console.log(temp);

            if(_.contains(partedFields.inCommon, field) || _.contains(partedFields.uniqueToProspect, field)) {
                prospectData[field] = $scope.object.data[field];
                // console.log(field);
                // console.log($scope.object.data[field].value);
                // console.log(data);
            } else {
                prospectData[field].value = null;
            }
        });

        deferred.resolve(prospectData);
        deferred.reject(new Error("Error creating new driver from prospect"));
        return deferred.promise;
    };

    $scope.convert = function() {
        objectHelpers.getFormDataAndReference('driver').then(function(result) {
            // console.log(result);
            ctrl.partitionFields($scope.object.data, result.referenceObject.data).then(function(partedFields) {
                // console.log(partedFields);
                // console.log($scope.object.data);
                ctrl.resolveNameConflicts(partedFields, $scope.object.data).then(function(result) {
                    // console.log(result);
                    ctrl.addProspectFieldsToExistingDrivers(result.partedFields.uniqueToProspect, result.prospectData).then(function(prospectDataWithNonConflictingFields) {    
                    // console.log(prospectDataWithNonConflictingFields);
                        ctrl.buildNewDriverData(prospectDataWithNonConflictingFields, result.partedFields).then(function(newDriverData) {
                            // console.log(newDriverData);
                            driverHelpers.createDriver(newDriverData).then(function(newDriver) {
                                if(newDriver.data.status) {
                                    delete newDriver.data.status;
                                }
                                // console.log(newDriver);
                                driverHelpers.saveDriver(newDriver).then(function() {
                                    prospectHelpers.deleteProspect($scope.object.id);  
                                    $state.go('dashboard.prospects');
                                });
                            });
                        });        
                    });
                });
            });
        });
    };
  });