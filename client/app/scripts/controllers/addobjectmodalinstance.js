// 'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddObjectModalInstanceCtrl
 * @description
 * # AddObjectModalInstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddObjectModalInstanceCtrl', function ($timeout, getCars, getAssets, getProspects, getDrivers, objectType, $q, $modal, assetHelpers, prospectHelpers, carHelpers, driverHelpers, dataService, $scope, $modalInstance, $state) {
    
    var ctrl = this;
    $scope.formData = {};
    $scope.objects = [];
    // $scope.representativeObject = {};
    $scope.identifier = { value: null };
    $scope.currentIdentifier = { value: null };
    $scope.fields = [];
    $scope.fieldsToHide = []
    $scope.fieldsToNotLog = [];
    $scope.statuses = [];
    $scope.status = {};
    $scope.assetTypes = [];
    $scope.assetType = { value: null };
    $scope.expressions = [];
    $scope.objectType = objectType;

    $scope.getNewFieldsToLog = function(formData) {
        return _.filter(Object.keys(formData), function(field) {
            return formData[field].log;
        });
    };
    
    $scope.getFormDataAndRepresentative = function() {};

    $scope.create = function() {};

    $scope.update = function() {};

    $scope.save = function() {};

    $scope.disableConditions = function() { return true; };

    $scope.hide = function(field) {
        return _.contains($scope.fieldsToHide, field);
    };

    $scope.dontLog = function(field) {
        return _.contains($scope.fieldsToNotLog, field);
    };

    $scope.invalidIdentifier = function(identifier) {
        return ((identifier.value === null) || (typeof identifier.value === 'undefined')) ? true : false;
    };

    $scope.identifierChanged = function() {
        return ($scope.identifier.value !== $scope.currentIdentifier.value);
    };

    $scope.disableAddField = function() {
        return (($scope.objectType === "asset") && (($scope.formData.assetType === null) || (typeof $scope.formData.assetType === 'undefined')));
    };

    // only for assets
    $scope.renderForm = function() {};

    ctrl.buildExpression = function(expressionItems) {
        var deferred = $q.defer();
        var expression = '';
        
        _.each(expressionItems, function(item) {
            expression = expression + item.value;
            // console.log(expression);
        });

        deferred.resolve(expression);
        deferred.reject(new Error('Error building expression'));
        return deferred.promise;
    };

    ctrl.getInequalitySign = function(signId) {
        switch(parseInt(signId)) {
            case 0:
                return ">";
                break;
            case 1:
                return '≥';
                break;
            case 2:
                return '<';
                break;
            case 3:
                return '≤';
                break;
            default:
                return '?';
                break;
        }
    };

    ctrl.hideExpressions = function(dataOfRepresentativeObject) {
        var deferred = $q.defer();
        // console.log($scope.objects);
        deferred.resolve(_.each(dataOfRepresentativeObject, function(data, field) {
            // console.log(data);
            if(data.type === 'function') {
                $scope.fieldsToHide.push(field);
                ctrl.buildExpression(data.expressionItems).then(function(expression) {
                    // console.log('built expression', expression);
                    $scope.expressions.push({
                        field: field,
                        expression: expression
                    });
                });
            } else if(data.type === 'inequality') {
                $scope.fieldsToHide.push(field);
                ctrl.buildExpression(data.leftExpressionItems).then(function(leftExpression) {
                    ctrl.buildExpression(data.rightExpressionItems).then(function(rightExpression) {
                        var inequalitySign = ctrl.getInequalitySign(data.inequalitySignId);
                        $scope.expressions.push({
                            field: field,
                            expression: leftExpression + " " + inequalitySign + " " + rightExpression
                        });
                    });
                });
            } else {
                // do nothing
            }
        }));
        deferred.reject(new Error('Error building or storing expression'));
        return deferred.promise;
    };
 
    // determine the state or ui calling this modal
    if($scope.objectType === 'driver') {
        // console.log('called from drivers ui');
        $scope.objects = getDrivers.data;
        $scope.update = driverHelpers.updateDriver;
        $scope.create = driverHelpers.createDriver;
        $scope.save = driverHelpers.saveDriver;
        $scope.getFormDataAndRepresentative = driverHelpers.getFormDataAndRepresentative;

        $scope.getFormDataAndRepresentative().then(function(result) {
            ctrl.hideExpressions(result.representativeData).then(function() {
                // console.log('formData:', result.formData);
                $scope.fieldsToHide.push("Name");
                // $scope.fieldsToNotLog.push("First Name");
                // $scope.fieldsToNotLog.push("Last Name");
                $scope.currentIdentifier.value = "Name";
                angular.copy($scope.currentIdentifier, $scope.identifier);
                $scope.formData = result.formData;
                $scope.fieldsToHide.push('assetType');
                $scope.formData.assetType = { value: null };
                // $scope.disableConditions = driverHelpers.namesNotNull;
            });
        });
    } else if($scope.objectType === 'car') {
        // console.log('called from cars ui');
        $scope.objects = getCars.data;
        $scope.update = carHelpers.updateCar;
        $scope.create = carHelpers.createCar;
        $scope.save = carHelpers.saveCar;
        $scope.getFormDataAndRepresentative = carHelpers.getFormDataAndRepresentative;

        $scope.getFormDataAndRepresentative().then(function(result) {
            carHelpers.getIdentifier().then(function(identifier) {
                ctrl.hideExpressions(result.representativeData).then(function() {
                    // console.log('car form data:', result.formData);
                    $scope.formData = result.formData;
                    $scope.fieldsToHide.push('assetType');
                    $scope.formData.assetType = { value: null };
                    $scope.fields = Object.keys(result.formData);
                    $scope.fields = _.without($scope.fields, "assetType");
                    $scope.currentIdentifier.value = identifier;
                    angular.copy($scope.currentIdentifier, $scope.identifier);
                    $scope.disableConditions = function(formData) { return true; };
                });
            });
        });
    } else if($scope.objectType === 'prospect') {
        // console.log('called from prospects ui');
        $scope.objects = getProspects.data;
        $scope.update = prospectHelpers.updateProspect;
        $scope.create = prospectHelpers.createProspect;
        $scope.save = prospectHelpers.saveProspect;
        $scope.getFormDataAndRepresentative = prospectHelpers.getFormDataAndRepresentative;

        $scope.getFormDataAndRepresentative().then(function(result) {
            prospectHelpers.getProspectStatuses().then(function(result) {
                ctrl.hideExpressions(result.representativeData).then(function() {
                    // console.log('prospect form data:', result.formData);
                    // console.log(statuses);
                    $scope.fieldsToHide.push("Name");
                    $scope.fieldsToHide.push("status");
                    $scope.fieldsToNotLog.push("First Name");
                    $scope.fieldsToNotLog.push("Last Name");
                    $scope.currentIdentifier.value = "Name";
                    angular.copy($scope.currentIdentifier, $scope.identifier);
                    $scope.formData = result.formData;
                    $scope.fieldsToHide.push('assetType');
                    $scope.formData.assetType = { value: null };
                    $scope.statuses = result.data.statuses;
                    $scope.disableConditions = prospectHelpers.namesNotNull;
                });
            });
        });
    } else if($scope.objectType === 'asset') {
        // console.log('called from assets ui');
        $scope.objects = getAssets.data;
        $scope.update = assetHelpers.updateAsset;
        $scope.create = assetHelpers.createAsset;
        $scope.save = assetHelpers.saveAsset;
        $scope.fieldsToHide.push("assetType");
        $scope.fieldsToNotLog.push("assetType");
        $scope.getFormDataAndRepresentative = assetHelpers.getFormDataAndRepresentative;

        assetHelpers.getAssetTypes().then(function(result){
            $scope.assetTypes = result.data.types;
            $scope.renderForm = function(assetType) {
                $scope.getFormDataAndRepresentative(assetType).then(function(result) {
                    // console.log(result.formData);
                    assetHelpers.getIdentifier(assetType).then(function(identifier) {
                        ctrl.hideExpressions(result.representativeData).then(function() {
                            $scope.fields = Object.keys(result.formData);
                            // $scope.fields = _.without($scope.fields, "assetType");
                            $scope.formData = result.formData;
                            $scope.disableConditions = assetHelpers.invalidAssetType;
                            $scope.currentIdentifier.value = identifier;
                            angular.copy($scope.currentIdentifier, $scope.identifier);
                        });
                    });
                });
            };
        });
    } else {
        $state.go("dashboard.cars");
    }

    $scope.submit = function() {
        // console.log($scope.identifier);
        // console.log($scope.formData.assetType);

        $scope.create($scope.formData, $scope.identifier.value, $scope.formData.assetType.value).then(function(object) {
            // console.log('saving:', object);

            if($scope.objectType === 'car') {
                $scope.save(object).then(function(result) {
                    if($scope.identifierChanged()) {
                        _.each($scope.objects, function(obj) {
                            // console.log(obj.id);
                            // console.log(result.data.id);
                            if(obj.id !== result.data.id) {
                                obj.identifier = $scope.identifier.value;
                                $scope.update(obj);
                            }
                        });
                    }

                    $scope.close(object);
                });
            } else if($scope.objectType === 'prospect') {
                prospectHelpers.getDefaultStatus().then(function(defaultStatus) {
                    object.status = { value: ($scope.status.value || defaultStatus.value) };
                    object.data.status = { value: ($scope.status.value || defaultStatus.value), log: false };

                    $scope.save(object).then(function(result) {
                        if($scope.identifierChanged()) {
                            _.each($scope.objects, function(obj) {
                                if(obj.id !== result.data.id) {
                                    obj.identifier = $scope.identifier.value;
                                    $scope.update(obj);
                                }
                            });
                        }

                        $scope.close(object);
                    });
                });
            } else if($scope.objectType === 'driver') {
                // console.log(object);
                $scope.save(object).then(function(result) {
                    if($scope.identifierChanged()) {
                        _.each($scope.objects, function(obj) {
                            if(obj.id !== result.data.id) {
                                obj.identifier = $scope.identifier.value;
                                $scope.update(obj);
                            }
                        });
                    }

                    $scope.close(object);
                });
            } else if($scope.objectType === 'asset') {
                // console.log(object);
                $scope.save(object).then(function(result) {
                    if($scope.identifierChanged()) {
                        assetHelpers.filterAssets($scope.objects, result.data.assetType).then(function(assetsOfType) {
                            _.each(assetsOfType, function(asset) {
                                if(asset.id !== result.data.id) {
                                   asset.identifier = $scope.identifier.value;
                                    $scope.update(obj);
                                }
                            })
                        });
                    }

                    $scope.close(object);
                });
            }
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

    ctrl.updateModal = function (newField) {
        var deferred = $q.defer();

        if(newField.type !== 'function' && newField.type !== 'inequality') {
            $scope.fields.push(newField.name);
            $scope.formData[newField.name] = newField.data;  

            deferred.resolve($scope.formData);
            deferred.reject(new Error("Error updating add object modal after adding number/text/boolean field"));
        } else {
            $scope.fieldsToHide.push(newField.name);
            $scope.expressions.push({
                field: newField.name,
                expression: expression,
            });

            deferred.resolve($scope.expressions);
            deferred.reject(new Error("Error updating add object modal after adding function/inequality field"));
        }

        return deferred.promise;
    };

    $scope.addField = function(assetType) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/addfieldmodal.html',
            controller: 'AddFieldModalInstanceCtrl',
            size: 'md',
            resolve: {
                getCars: function(dataService) {
                    return (objectType === 'car') ? $scope.objects : {};
                },
                getDrivers: function(dataService) {
                    return (objectType === 'driver' ? $scope.objects : {});
                },
                getProspects: function(dataService) {
                    return (objectType === 'prospect' ? $scope.objects : {});  
                },
                getAssets: function(dataService) {
                    return {
                        data: (objectType === 'asset' ? $scope.objects : {}),
                        type: $scope.assetType.value
                    };
                },
                objectType: function() {
                    return objectType;
                },
                assetType: function() {
                    return objectType === 'asset' ? assetType : null;
                }
            }
        });

        modalInstance.result.then(function (newField) {
            // console.log(newField);
            if(newField.data.type !== 'function' && newField.data.type !== 'inequality') {
                $scope.fields.push(newField.name);
                $scope.formData[newField.name] = newField.data;  
            } else {
                $scope.fieldsToHide.push(newField.name);
                $scope.expressions.push({
                    field: newField.name,
                    expression: newField.data.expression,
                });
            }
        }, function() {
            $state.forceReload();
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });
