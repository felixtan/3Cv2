'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddobjectmodalinstanceCtrl
 * @description
 * # AddobjectmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddObjectModalInstanceCtrl', function ($modal, assetHelpers, prospectHelpers, carHelpers, driverHelpers, dataService, $scope, $modalInstance, $state) {
    $scope.formData = {};
    $scope.objects = [];
    $scope.objectType = null;
    $scope.identifier = { value: null };
    $scope.currentIdentifier = { value: null };
    $scope.fields = [];
    $scope.fieldsToHide = []
    $scope.fieldsToNotLog = [];
    $scope.statuses = [];
    $scope.status = {};
    $scope.assetTypes = [];
    $scope.assetType = { value: null };

    $scope.getNewFieldsToLog = function(formData) {
        return _.filter(Object.keys(formData), function(field) {
            return formData[field].log;
        });
    };
    
    $scope.create = function() {};

    $scope.update = function() {};

    $scope.save = function() {};

    $scope.disableConditions = function() {};

    $scope.hide = function(field) {
        return _.contains($scope.fieldsToHide, field);
    };

    $scope.dontLog = function(field) {
        return _.contains($scope.fieldsToNotLog, field);
    };

    $scope.invalidIdentifier = function(identifier) {
        return ((identifier.value === null) || (typeof identifier.value === 'undefined')) ? true : false;
    };

    $scope.differentIdentifier = function() {
        return ($scope.identifier.value !== $scope.currentIdentifier.value);
    };

    $scope.disableAddField = function() {
        return (($scope.objectType === "asset") && (($scope.assetType.value === null) || (typeof $scope.assetType.value === 'undefined')));
    };

    // only for assets
    $scope.renderForm = function() {};

    // determine the state or ui calling this modal
    if($state.includes('dashboard.drivers')) {
        console.log('called from drivers ui');
        $scope.objectType = 'driver';
        $scope.update = driverHelpers.updateDriver;
        $scope.create = driverHelpers.createDriver;
        $scope.save = driverHelpers.saveDriver;
        driverHelpers.getFormData().then(function(formData) {
            // console.log('driver form data:', formData);
            $scope.fieldsToHide.push("fullName");
            $scope.fieldsToNotLog.push("First Name");
            $scope.fieldsToNotLog.push("Last Name");
            $scope.currentIdentifier.value = "fullName";
            angular.copy($scope.currentIdentifier, $scope.identifier);
            $scope.formData = formData;
            $scope.disableConditions = driverHelpers.namesNotNull;
        });
    } else if($state.includes('dashboard.cars')) {
        console.log('called from cars ui');
        $scope.objectType = 'car';
        $scope.update = carHelpers.updateCar;
        $scope.create = carHelpers.createCar;
        $scope.save = carHelpers.saveCar;
        carHelpers.getFormData().then(function(formData) {
            carHelpers.getIdentifier().then(function(identifier) {
                // console.log('car form data:', formData);
                $scope.formData = formData;
                $scope.fields = Object.keys(formData);
                $scope.currentIdentifier.value = identifier;
                angular.copy($scope.currentIdentifier, $scope.identifier);
                $scope.disableConditions = function(formData) { return true; };
            });
        });
    } else if($state.includes('dashboard.prospects')) {
        console.log('called from prospects ui');
        $scope.objectType = 'prospect';
        $scope.update = prospectHelpers.updateProspect;
        $scope.create = prospectHelpers.createProspect;
        $scope.save = prospectHelpers.saveProspect;
        prospectHelpers.getFormData().then(function(formData) {
            prospectHelpers.getProspectStatuses().then(function(result) {
                // console.log('prospect form data:', formData);
                // console.log(statuses);
                $scope.fieldsToHide.push("fullName");
                $scope.fieldsToHide.push("status");
                $scope.fieldsToNotLog.push("First Name");
                $scope.fieldsToNotLog.push("Last Name");
                $scope.currentIdentifier.value = "fullName";
                angular.copy($scope.currentIdentifier, $scope.identifier);
                $scope.formData = formData;
                $scope.statuses = result.data.statuses;
                $scope.disableConditions = prospectHelpers.namesNotNull;
            });
        });
    } else if($state.includes('dashboard.assets')) {
        console.log('called from assets ui');
        $scope.objectType = 'asset';
        $scope.update = assetHelpers.updateAsset;
        $scope.create = assetHelpers.createAsset;
        $scope.save = assetHelpers.saveAsset;
        $scope.fieldsToHide.push("assetType");
        $scope.fieldsToNotLog.push("assetType");
        
        assetHelpers.getAssetTypes().then(function(result){
            $scope.assetTypes = result.data.types;
            $scope.renderForm = function(assetType) {
                assetHelpers.getFormData(assetType).then(function(formData) {
                    assetHelpers.getIdentifier(assetType).then(function(identifier) {
                        $scope.fields = Object.keys(formData);
                        $scope.formData = formData;
                        $scope.disableConditions = assetHelpers.invalidAssetType;
                        $scope.currentIdentifier.value = identifier;
                        angular.copy($scope.currentIdentifier, $scope.identifier);
                    });
                });
            };
        });
    } else {
        console.log('add object modal called from invalid state', $state.current);
    }

    $scope.submit = function() {
        $scope.create($scope.formData, $scope.identifier.value, $scope.assetType.value).then(function(object) {
            // console.log('saving:', object);

            // TODO: better pre-save processing

            // if($scope.objectType === 'asset') {
            //     $scope
            // }

            if($scope.objectType === 'car') {
                if($scope.differentIdentifier()) {    // setIdentifier
                    carHelpers._updateIdentifier($scope.identifier.value);
                    object.identifier = $scope.identifier.value;
                }

                $scope.save(object).then(function(result) {
                    $scope.close(object);
                });
            }

            if($scope.objectType === 'prospect') {
                prospectHelpers.getDefaultStatus().then(function(defaultStatus) {
                    object.status = { value: ($scope.status.value || defaultStatus.value) };
                    object.data.status = { value: ($scope.status.value || defaultStatus.value), log: false };

                    $scope.save(object).then(function(result) {
                        $scope.close(object);
                    });
                });
            }

            if(($scope.objectType === 'driver') || ($scope.objectType === 'asset')) {
                // console.log(object);
                $scope.save(object).then(function(result) {
                    $scope.close(object);
                });
            }

            // $scope.save(object).then(function(result) {
                // var newObject = result.data;
                // if log = true for fields created in this session, update all objects and object logs
                // var fieldsToLog = $scope.getNewFieldsToLog($scope.formData);
                // console.log(fieldsToLog);
                // _.each(fieldsToLog, function(field) {
                //     console.log(field);
                //     _.each($scope.objects, function(otherObject) {
                //         if(otherObject.id !== newObject.id) {
                //             otherObject.data[field].log = true;
                //             _.each(otherObject.logs, function(log) {
                //                 log.data[field] = null;
                //             });
                //             $scope.update(otherObject);
                //         }
                //     });
                // });

                // $scope.close(object);
            // });     
        });
    };

    $scope.reset = function () {
      $scope.formData = {};
      $scope.form.$setPristine();
      $scope.form.$setUntouched();
      $state.forceReload();
    };

    $scope.ok = function(object) {
        $state.forceReload();
        $modalInstance.close(object);
    };

    $scope.close = function () {
        $state.forceReload();
        $modalInstance.dismiss('close');
    };

    $scope.addField = function(assetType) {

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
                    return {
                        data: (($state.includes('assetProfile') || $state.includes('dashboard.assets')) ? dataService.getAssets() : {}),
                        type: assetType
                    };
                }
            }
        });

        modalInstance.result.then(function (newField) {
            $scope.fields.push(newField);
            $scope.formData[newField] = { value: null, log: false };
            $state.forceReload();
        }, function() {
            $state.forceReload();
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });
