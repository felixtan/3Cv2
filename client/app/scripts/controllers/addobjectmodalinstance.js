'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddobjectmodalinstanceCtrl
 * @description
 * # AddobjectmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddObjectModalInstanceCtrl', function ($modal, prospectHelpers, carHelpers, driverHelpers, getProspects, getDrivers, getCars, dataService, $scope, $modalInstance, $state) {
    $scope.formData = {};
    $scope.objects = [];
    $scope.objectType = null;
    $scope.fieldsToHide = []
    $scope.fieldsToNotLog = [];
    $scope.newFields = [];

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
            $scope.formData = formData;
            $scope.disableConditions = driverHelpers.namesNotNull;
        });
    } else if($state.includes('dashboard.cars')) {
        console.log('called from cars ui');
        $scope.objectType = 'car';
        $scope.object = (getCars.data > 0) ? getCars.data[0] : {};
        $scope.create = dataService.createCar;
    } else if($state.includes('dashboard.prospects')) {
        console.log('called from prospects ui');
        $scope.objectType = 'prospect';
        $scope.object = (getProspects.data > 0) ? getProspects.data[0] : {};
        $scope.create = dataService.createProspect;
    } else {
        console.log('add object modal called from invalid state', $state.current);
    }

    $scope.submit = function() {
        $scope.create($scope.formData).then(function(object) {
            // console.log('saving:', object);
            $scope.save(object).then(function(result) {
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

                $scope.close(object);
            });     
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
                }
            }
        });

        modalInstance.result.then(function (newField) {
            $scope.newFields.push(newField);
            $scope.formData[newField] = { value: null, log: false };
            $state.forceReload();
        }, function() {
            $state.forceReload();
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });
