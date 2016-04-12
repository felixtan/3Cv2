'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:CardataCtrl
 * @description
 * # CardataCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ObjectDataCtrl', function (objectType, objectId, objectHelpers, assetHelpers, prospectHelpers, driverHelpers, carHelpers, $q, $state, $scope, $modal) {   
    
    var ctrl = this;        // for testing;
    $scope.objectType = objectType;
    $scope.assetType = { value: null };
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
            return assetHelpers.get;
        }
    };

    ctrl.getObject()(objectId).then(function(result1) {
        if(typeof result1 !== 'undefined') $scope.object = result1.data;
        // console.log($scope.objectType);
        $scope.identifierValue = $scope.object.data[$scope.object.identifier].value;

        $scope.tabs = [
            { title: 'Data', active: true, state: $scope.state.data },
            { title: 'Logs', active: false, state: $scope.state.logs }
        ];

        ctrl.getObjects()().then(function(result2) {
            $scope.objects = result2.data;
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
                    return ($scope.objectType === 'car') ? $scope.objects : {};
                },
                getDrivers: function() {
                    return ($scope.objectType === 'driver') ? $scope.objects : {};
                },
                getProspects: function() {
                    return ($scope.objectType === 'prospect') ? $scope.objects : {};  
                },
                getAssets: function() {
                    return {
                        data: ($scope.objectType === 'asset') ? $scope.objects : {},
                        type: $scope.assetType.value
                    };
                },
                assetType: function() {
                    return $scope.objectType === 'asset' ? assetType : null;
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
                    // console.log($scope.objects);
                    return $scope.objectType === 'car' ? $scope.objects : [];
                },
                getProspects: function() {
                    return $scope.objectType === 'prospect' ? $scope.objects : [];
                },
                getDrivers: function() {
                    return $scope.objectType === 'driver' ? $scope.objects : [];
                },
                getAssets: function() {
                    return $scope.objectType === 'asset' ? $scope.objects : [];
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
        return ($scope.objectType === "prospect" || $scope.objectType === 'driver') && field === "Name";
    };

    $scope.notStatus = function(field) {
        return (field.toLowerCase() != "status");
    };

    String.prototype.capitalizeIfStatus = function() {
        return (this === 'status' && $scope.objectType === "prospect") ? (this.charAt(0).toUpperCase() + this.slice(1)) : this;
    };

    $scope.notNameOrStatus = function(field) {
        return ((field != "First Name") && (field != "Last Name") && (field !== "Name") && (field.toLowerCase() != "status"));
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

    // used in convert?
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
                var renamedField = ctrl.getUniqueFieldName(Object.keys(driverData), field);
                prospectFieldsToAddToAllDrivers.push(renamedField);
                prospectDataOnlyFieldsInCommon[renamedField] = prospectDataOnlyFieldsInCommon[field];
                delete prospectDataOnlyFieldsInCommon[field];
            }
        });

        deferred.resolve({
            prospectDataFieldsUnCommon: prospectDataFieldsUnCommon,
            prospectDataFieldsInCommon: prospectDataFieldsInCommon,
            prospectFieldsToAddToAllDrivers: _.without(prospectFieldsToAddToAllDrivers, "status")
        });

        deferred.reject(new Error('Error splitting prospect data via fields in common with driver data.'));
        return deferred.promise;
    };

    // Adds unique prospect fields to all drivers, renaming if necessary
    // Returns data of first updated driver
    ctrl.addProspectFieldsToExistingDrivers = function (fieldsUniqueToProspect, fieldsUniqueToDrivers, prospectData) {
        var deferred = $q.defer();

        driverHelpers.get().then(function(result) {
            var drivers = result.data;
            // console.log(drivers);
            if(typeof drivers !== 'undefined' && drivers !== null) {
                if(drivers.length > 0) {
                    _.each(drivers, function(driver, index, list) {
                        // console.log(driver);
                        // console.log(index);
                        // console.log(list);

                        _.each(fieldsUniqueToProspect, function(field) {
                            var temp = ctrl.getUniqueFieldName(fieldsUniqueToDrivers, field);
        
                            objectHelpers.updateExpressionFieldsIfFieldNameChanged(field, temp, prospectData).then(function(prospectDataWithUpdatedExpressions) {
                                console.log(prospectDataWithUpdatedExpressions);
                                objectHelpers.evaluateExpressionAndAppendValue(prospectDataWithUpdatedExpressions, field).then(function(prospectDataWithUpdatedExpressionValues) {
                                    console.log(prospectDataWithUpdatedExpressionValues);
                                    objectHelpers.storeFieldsUsed(prospectDataWithUpdatedExpressionValues, field).then(function(prospectDataToConvert) {

                                        driver.data[temp] = {
                                            value: null,
                                            log: false,
                                            type: prospectDataToConvert[field].type,
                                            dataType: prospectDataToConvert[field].dataType,
                                            expression: (prospectDataToConvert[field].type === 'function') ? prospectDataToConvert[field].expression : undefined,
                                            expressionItems: prospectDataToConvert[field].type === 'function' ? prospectDataToConvert[field].expressionItems : undefined,
                                            leftExpressionItems: prospectDataToConvert[field].type === 'inequality' ? prospectDataToConvert[field].leftExpressionItems : undefined,
                                            rightExpressionItems: prospectDataToConvert[field].type === 'inequality' ? prospectDataToConvert[field].rightExpressionItems : undefined,
                                            inequalitySignId: prospectDataToConvert[field].type === 'inequality' ? prospectDataToConvert[field].inequalitySignId : undefined,
                                            inequalitySign: prospectDataToConvert[field].type === 'inequality' ? prospectDataToConvert[field].inequalitySign : undefined,
                                            leftExpression: prospectDataToConvert[field].type === 'inequality' ? prospectDataToConvert[field].leftExpression : undefined,
                                            rightExpression: prospectDataToConvert[field].type === 'inequality' ? prospectDataToConvert[field].rightExpression : undefined,
                                        };

                                        delete driver.data.status;
                                        console.log(driver);

                                        // Runs regardless of whether fieldsUniqueToProspect >= 0
                                        driverHelpers.update(driver).then(function(result) {
                                            if(index === 0) {
                                                console.log(result.config.data.data);
                                                deferred.resolve(result.config.data.data);
                                                deferred.reject(new Error("Error getting updated driver data after adding prospect fields"));
                                            }
                                        });
                                    });
                                });
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

    ctrl.buildNewDriverData = function(driverData, partedFields) {
        var deferred = $q.defer();
        console.log(driverData);
        _.each(driverData, function(data, field) {
            var temp = field.replace(/~/g, "");
            // console.log(temp);
            console.log()
            if(_.contains(partedFields.inCommon, temp) && data.type === $scope.object.data[temp].type) {
                console.log('in common:', temp, field);
                console.log($scope.object.data);
                console.log($scope.object.data[temp]);
                data = $scope.object.data[temp];
            } else if(_.contains(partedFields.uniqueToProspect, temp) && driverData[field].type === $scope.object.data[temp].type) {
                console.log('unique to p:', temp, field);
                console.log($scope.object.data);
                console.log($scope.object.data[temp]);
                data = $scope.object.data[temp];
            } else if(_.contains(partedFields.uniqueToDriver, temp)) {
                console.log('unique to d:', temp, field);
                data.value = null;
            }
        });

        deferred.resolve(driverData);
        deferred.reject(new Error("Error creating new driver from prospect"));
        return deferred.promise;
    };

    $scope.convert = function() {
        driverHelpers.getFormDataAndRepresentative().then(function(driverData) {
            // console.log(driverData);
            ctrl.partitionFields($scope.object.data, driverData.representativeData).then(function(partedFields) {
                // console.log(partedFields);
                ctrl.addProspectFieldsToExistingDrivers(partedFields.uniqueToProspect, partedFields.uniqueToDriver, $scope.object.data).then(function(objectData) {
                    // console.log(objectData);

                    if(typeof objectData !== 'undefined' && objectData !== null) {
                        ctrl.buildNewDriverData(objectData, partedFields).then(function(newDriverData) {
                            console.log(newDriverData);
                            driverHelpers.createDriver(newDriverData).then(function(newDriver) {
                                console.log(newDriver);
                                driverHelpers.saveDriver(newDriver).then(function(result) {
                                    prospectHelpers.deleteProspect($scope.object.id);  
                                    $state.go('dashboard.prospects');
                                });
                            });
                        });
                    }                 
                });


                // var newDriverData = _.extend(driversData.representativeData, result.prospectDataOnlyFieldsInCommon, result.prospectDataMinusFieldsInCommon);
                // delete newDriverData.status;
                // console.log('newDriverData:', newDriverData);
                // console.log('add these fields to all drivers:', result.prospectFieldsToAddToAllDrivers);
                // driverHelpers.createDriver(newDriverData).then(function(newDriverObj) {
                //     console.log('newDriverObj:', newDriverObj);
                //     driverHelpers.saveDriver(newDriverObj).then(function(newDriver) {
                //         console.log(newDriver);
                //         driverHelpers.getById(newDriver.data.id).then(function(promiseResult) {
                //             var driver = promiseResult.data;
                //             console.log(driver);
                //             console.log(result.prospectDataOnlyFieldsInCommon);
                //             _.each(result.prospectFieldsToAddToAllDrivers, function(field) {
                //                 driver.data[field] = { 
                //                     value: newDriver[field].value, 
                //                     log: false,
                //                     type: newDriver[field].type,
                //                     dataType: newDriver[field].dataType,
                //                 };
                //             });
                //             console.log(driver);
                //             driverHelpers.update(driver);
                //         });
                            
                //         prospectHelpers.deleteProspect($scope.object.id).then(function() {
                //             $state.go('dashboard.prospects');
                //         });
                //     });
                // });
            });
        });
    };
  });