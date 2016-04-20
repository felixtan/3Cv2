'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:EditexpressionmodalctrlCtrl
 * @description
 * # EditexpressionmodalctrlCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('EditFieldModalCtrl', function (objectHelpers, $modal, dataService, getDrivers, getAssets, getProspects, getCars, $modalInstance, $state, $scope, field, _object, objectType, $q, carHelpers, driverHelpers, prospectHelpers, assetHelpers) {
    
    var ctrl = this,
        buildEvalExpression = objectHelpers.buildEvalExpression,
        buildDisplayExpression = objectHelpers.buildDisplayExpression,
        notName = driverHelpers.notName;

    $scope.fieldNamesNotToEdit = [];
    $scope.statuses = null;
    $scope.prospectStatuses = null;

    $scope.loggable = function (fieldName) {
      if($scope.objectType !== 'prospect') {
        return notName(fieldName);
      } else {
        return false;
      }
    };

    String.prototype.capitalizeIfStatus = function() {
        return (this === 'status' && $scope.objectType === "prospect") ? (this.charAt(0).toUpperCase() + this.slice(1)) : this;
    };

    $scope.dontEditFieldName = function(fieldName) {
      return _.contains($scope.fieldNamesNotToEdit, fieldName);
    };

    $scope.displayInequalitySign = function(signId) {
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
          return "?";
          break;
      }
    };

    ctrl.buildTestExpressionItems = function(expressionItems) {
        var deferred = $q.defer(),
            arr = [];
        _.each(expressionItems, function(item) {
            // console.log(item);
            if(item.type === 'field') {
                arr.push({
                  type: 'field',
                  value: '1'
                });
            } else {
                arr.push(item);
            }
        });
        
        deferred.resolve(arr);
        deferred.reject(new Error("Error building test expression"));
        return deferred.promise;
    };

    ctrl.setValidFieldsForExpressions = function (objectData) {
        // only numbers
        // neglect the field in questions or else shit gets recursive
        // console.log(objectData);
        var keys = Object.keys(objectData);
        $scope.validFieldsForExpressions = _.filter(keys, function(key) {
            return ((objectData[key].dataType === 'number') && (key !== field));
        });
    };

    ctrl.buildAndValidateExpression = function() {
      // console.log('building and validating');
      ctrl.displayExpression().then(function(expressionItems) {
        // console.log(expressionItems);
        ctrl.buildTestExpressionItems(expressionItems).then(function(testExpressionItems) {
          // console.log(testExpressionItems);
          buildDisplayExpression(testExpressionItems).then(function(testExpression) {
            // console.log(testExpression);
            ctrl.validateExpression(testExpression);
          }); 
        });
      });
    };
    $scope.buildAndValidateExpression = ctrl.buildAndValidateExpression;

    // build expression user sees and return related expression itens
    ctrl.displayExpression = function() {
      var deferred = $q.defer();

      if($scope.field.type === 'function') {
        $scope.field.expression = "";
        _.each($scope.field.expressionItems, function(item) {
          $scope.field.expression += item.value;
        });

        deferred.resolve($scope.field.expressionItems);
        deferred.reject(new Error('Error building display expression'));
      } else {
        
        // $scope.setInequalitySign();

        if(!$scope.rightSide.value) {
          $scope.field.leftExpression = "";
          _.each($scope.field.leftExpressionItems, function(item) {
            $scope.field.leftExpression += item.value;
          });

          deferred.resolve($scope.field.leftExpressionItems);
          deferred.reject(new Error('Error building display expression'));
        } else {
          $scope.field.rightExpression = "";
          _.each($scope.field.rightExpressionItems, function(item) {
            $scope.field.rightExpression += item.value;
          });

          deferred.resolve($scope.field.rightExpressionItems);
          deferred.reject(new Error('Error building display expression'));
        }
      }

      return deferred.promise;
    };

    ctrl.validateExpression = function(testExpression) {
      $scope.expressionErrorMessage = undefined;
      $scope.validExpression.value = true; 

      try {
        $scope.$eval(testExpression);
      } catch(e){
        console.error(e);
        $scope.validExpression.value = false;
        $scope.expressionErrorMessage = e.message;
      }

      // set $scope.validExpression
    };

    $scope.isProspectStatus = function(fieldName) {
      return $scope.objectType === 'prospect' && fieldName === 'status';
    };

    // INITIALIZE
    ctrl.initialize = function() {
      $scope.logValueChanged = { value: false };
      $scope.expressionFieldSelect = { value: null };
      $scope.expressionConstantInput = { value: null };
      $scope.validExpression = { value: true };
      $scope.expressionErrorMessage = null;
      $scope.rightSide = { value: false };
      $scope.object = _object;
      $scope.fields = _.without(Object.keys($scope.object.data), field);
      $scope.objects = [];
      $scope.objectType = objectType;

      // console.log($scope.object.status);
      // console.log(field);
      // console.log($scope.objectType);
      // console.log($scope.isProspectStatus(field));
      $scope.field = {
          name: field,
          type: $scope.object.data[field].type,
          dataType: $scope.object.data[field].dataType,
          value: $scope.isProspectStatus(field) ? $scope.object.status : $scope.object.data[field].value,
          log: $scope.object.data[field].log,
          expression: null,
          expressionItems: null,
          leftExpression: null,
          leftExpressionItems: null,
          rightExpression: null,
          rightExpressionItems: null,
          inequalitySignId: null,
          inequalitySign: null,
          identifier: $scope.object.identifier === field,
      };

      if($scope.field.type === 'function') {
        $scope.field.expression = $scope.object.data[field].expression;
        $scope.field.expressionItems = $scope.object.data[field].expressionItems;
        // ctrl.initDisplayExpression(); 
      } else if($scope.field.type === 'inequality') {
        $scope.field.leftExpressionItems = $scope.object.data[field].leftExpressionItems;
        $scope.field.rightExpressionItems = $scope.object.data[field].rightExpressionItems;
        $scope.field.inequalitySignId = $scope.object.data[field].inequalitySignId;
        $scope.field.inequalitySign = $scope.object.data[field].inequalitySign;
        $scope.field.rightExpression = $scope.object.data[field].rightExpression;
        $scope.field.leftExpression = $scope.object.data[field].leftExpression;
        // ctrl.initDisplayExpression(); 
      } else {
        // nada
      }
    };
    ctrl.initialize();
    ctrl.setValidFieldsForExpressions($scope.object.data);

    if(objectType === 'car') {
        // console.log('object type is car');
        $scope.update = carHelpers.update;
        $scope.objects = getCars;
    } else if(objectType === 'driver') {
      $scope.fieldNamesNotToEdit.push("First Name", "Last Name");
        $scope.update = driverHelpers.update;
        $scope.objects = getDrivers;
    } else if(objectType === 'prospect') {
        $scope.fieldNamesNotToEdit.push("status", "First Name", "Last Name");
        $scope.update = prospectHelpers.update;
        $scope.objects = getProspects;
        prospectHelpers.getStatuses().then(function(result) {
          $scope.prospectStatuses = result.data;
          $scope.statuses = $scope.prospectStatuses.statuses;
          // console.log($scope.statuses);
        });
    } else if (objectType === 'asset') {
        $scope.update = assetHelpers.update;
        // $scope.objects = assetHelpers.getAssetsOfType($scope.object.assetType);
        $scope.objects = getAssets;
    } else {
        alert('Unrecognized object type!');
    }

    $scope.fieldNameAlreadyExists = function () {
      return _.contains($scope.fields, $scope.field.name);
    };

    /*
      Type of items     Additonal actions 
      -------------     -----------------
      operator          ?
      constant          none
      field             replace with 1 for testExpression
    */
    $scope.appendItemToFunction = function(item, typeOfItem) {
      
      if($scope.field.type === 'function') {
        $scope.field.expressionItems.push({ 
          type: typeOfItem, 
          value: item,
        });
        // console.log('after append:', $scope.field.expressionItems);
      } else {
        if($scope.rightSide.value) {
          $scope.field.rightExpressionItems.push({ 
            type: typeOfItem, 
            value: item,
          });
          // console.log('after append:', $scope.field.leftExpressionItems);
        } else {
          $scope.field.leftExpressionItems.push({ 
            type: typeOfItem, 
            value: item,
          });
          // console.log('after append:', $scope.field.rightExpressionItems);
        }
      }

      // set expression
      ctrl.buildAndValidateExpression();
      
      // resetting
      $scope.expressionFieldSelect.value = null;
      $scope.expressionConstantInput.value = null;
    };

    $scope.undoExpression = function() {
      if($scope.field.type === 'function') {
        if($scope.field.expressionItems.length) {
          var item = $scope.field.expressionItems[$scope.field.expressionItems.length-1];
          console.log('removed:', item);
          $scope.field.expressionItems.pop();
        }
      } else {
        if($scope.rightSide.value) {
          if($scope.field.rightExpressionItems.length) {
            var item = $scope.field.rightExpressionItems[$scope.field.rightExpressionItems.length-1];
            console.log('removed:', item);
            $scope.field.rightExpressionItems.pop();
          }
        } else {
          if($scope.field.leftExpressionItems.length) {
            var item = $scope.field.leftExpressionItems[$scope.field.leftExpressionItems.length-1];
            console.log('removed:', item);
            $scope.field.leftExpressionItems.pop();
          }
        }
      }
      
      ctrl.buildAndValidateExpression();
    };

    $scope.clearExpression = function() {
      if($scope.field.type === 'function') {
        $scope.field.expression = "";
        $scope.field.expressionItems = [];
      } else {
        if($scope.rightSide.value) {
          $scope.field.rightExpression = "";
          $scope.field.rightExpressionItems = [];
        } else {
          $scope.field.leftExpression = "";
          $scope.field.leftExpressionItems = [];
        }
      }
    };

    ctrl.pruneFieldData = function (fieldData) {
      var deferred = $q.defer(),
          data = {};

      angular.copy(fieldData, data);

      delete data.identifier;
      delete data.name;

      if($scope.field.type === 'function') {
        delete data.leftExpression;
        delete data.leftExpressionItems;
        delete data.rightExpression;
        delete data.rightExpressionItems;
        delete data.inequalitySignId;
        delete data.inequalitySign;

        fieldData.expressionItems = $scope.field.expressionItems;
      } else if($scope.field.type === 'inequality') {
        delete data.expressionItems;
        delete data.inequalitySign;
        delete data.expression;

        fieldData.leftExpressionItems = $scope.field.leftExpressionItems;
        fieldData.rightExpressionItems = $scope.field.rightExpressionItems;
        fieldData.inequalitySignId = $scope.field.inequalitySignId;
      } else {
        delete data.expression;
        delete data.expressionItems;
        delete data.leftExpression;
        delete data.leftExpressionItems;
        delete data.rightExpression;
        delete data.rightExpressionItems;
        delete data.inequalitySignId;
        delete data.inequalitySign;
      }

      deferred.resolve(data);
      deferred.reject(new Error("Error pruning field data"));
      return deferred.promise;
    };

    ctrl.buildAndAppendDisplayExpression = function(object) {
      var deferred = $q.defer();

      if(typeof object.data[$scope.field.name] !== 'undefined') {
        if($scope.field.type === 'function') {
          buildDisplayExpression($scope.field.expressionItems).then(function(expression) {
            object.data[$scope.field.name].expression = expression;
          });
        } else if($scope.field.type === 'inequality') {
          buildDisplayExpression($scope.field.leftExpressionItems).then(function(leftExpression) {
            buildDisplayExpression($scope.field.rightExpressionItems).then(function(rightExpression) {
              var inequalitySign = objectHelpers.getInequalitySign($scope.field.inequalitySignId);
              object.data[$scope.field.name].leftExpression = leftExpression;
              object.data[$scope.field.name].inequalitySign = inequalitySign;
              object.data[$scope.field.name].rightExpression = rightExpression;
            });
          });
        }
      }

      deferred.resolve(object);
      deferred.reject(new Error("Error appending expression to field data"));
      return deferred.promise;
    };

    ctrl.updateLogStuff = function (object) {
      var deferred = $q.defer();
      
      if($scope.logValueChanged.value) {
        object.data[field].log = $scope.field.log;
        object.data[$scope.field.name].log = $scope.field.log;
        // console.log(object.data[field]);
        // console.log(object.data[$scope.field.name]);
        // console.log($scope.object);
        if($scope.field.log) {
          console.log('log value changed to true');
          _.each(object.logs, function(log) {
            log.data[$scope.field.name] = null;
            /*
              TODO:
                Implement functions and inequalities for logs
                1. It calculates value only if all requisite fields are also logged and have a value for a given log
            */ 
          });
        }
      } else {
        /*
          1. log value didn't change
          2. log value is true
          3. field name changed
        */
        if($scope.field.log && $scope.field.name !== field) {
          _.each(object.logs, function(log) {
            log.data[$scope.field.name] = log.data[field];
            delete log.data[field];
          });
        }
      }

      deferred.resolve(object);
      deferred.reject(new Error("Error updating logs for field " + $scope.field.name));
      return deferred.promise;
    };

    $scope.submit = function() {
      if($scope.objectType === 'prospect' && $scope.field.name === 'status') {
        // console.log($scope.field);
        $scope.object.status = $scope.field.value;
        $scope.object.data[$scope.field.name].value = $scope.field.value.value;
        $scope.update($scope.object);
      } else {
        console.log($scope.field);
        _.each($scope.objects, function(object) {
          objectHelpers.updateDataIfFieldNameChanged(field, $scope.field.name, object).then(function(withNewFieldName) {
            // console.log('0 object: ', withNewFieldName);
            ctrl.updateLogStuff(withNewFieldName).then(function(withUpdatedLogs) {
              // console.log('1 object:', withUpdatedLogs);
              ctrl.buildAndAppendDisplayExpression(withUpdatedLogs).then(function(withAppendedExpression) {
                // console.log('2 object:', withAppendedExpression);
                ctrl.pruneFieldData(withAppendedExpression.data[$scope.field.name]).then(function() {
                  objectHelpers.updateExpressionFieldsIfFieldNameChanged(field, $scope.field.name, withAppendedExpression.data).then(function(dataWithUpdatedExpressions) {
                    withAppendedExpression.data = dataWithUpdatedExpressions;
                    var withUpdatedExpressions = withAppendedExpression;
                    // console.log('3 object:', withUpdatedExpressions);
                    objectHelpers.evaluateExpressionAndAppendValue(withUpdatedExpressions.data, $scope.field.name).then(function(dataWithValue) {
                      withUpdatedExpressions.data = dataWithValue;
                      var withValue = withUpdatedExpressions;
                      // console.log('4 object:', withValue);
                      objectHelpers.storeFieldsUsed(withValue, $scope.field.name).then(function(withUpdatedFieldsUsed) {
                        // console.log('5 object:', withUpdatedFieldsUsed);
                        objectHelpers.updateFieldValueAndExpressionValues($scope.field.value, $scope.field.name, withUpdatedFieldsUsed, $scope.object.id).then(function(objectToSave) {
                          // console.log('6 object:', objectToSave);

                          // identifier changed?
                          if($scope.field.identifier) {
                            objectToSave.identifier = $scope.field.name;
                          }

                          // if driver/prospect Last Name and/or First Name was changed, then update Name
                          if($scope.object.id === objectToSave.id && ($scope.objectType === 'prospect' || $scope.objectType === 'driver') && ($scope.field.name === "First Name" || $scope.field.name === "Last Name")) {
                            if($scope.field.name === "First Name") {
                              objectToSave.data["Name"].value = $scope.field.value + " " + objectToSave.data["Last Name"].value;
                            } else if($scope.field.name === "Last Name") {
                              objectToSave.data["Name"].value = objectToSave.data["First Name"].value + " " + $scope.field.value;
                            }
                          }

                          // console.log(objectToSave);
                          $scope.update(objectToSave);
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }

      $scope.ok();
    };

    $scope.invalidFieldType = function() {
      return (($scope.field.type === null) || (typeof $scope.field.type === 'undefined') || ($scope.field.dataType === null) || (typeof $scope.field.dataType === 'undefined'));
    };

    $scope.emptyExpression = function() {
      if($scope.field.type === 'function') {
        return ($scope.field.expressionItems.length > 0) ? false : true;
      } else if($scope.field.type === 'inequality') {
        return (($scope.field.leftExpressionItems.length > 0) && ($scope.field.rightExpressionItems.length > 0) && ($scope.field.inequalitySignId !== null) && (typeof $scope.field.inequalitySignId !== 'undefined')) ? false : true;
      } else {
        return false;
      }
    };

    $scope.inequalityIsComplete = function() {
      if($scope.field.type === 'inequality') {
        return (($scope.field.rightExpressionItems.length > 0) && ($scope.field.leftExpressionItems.length > 0) && ($scope.field.inequalitySignId !== null) && (typeof $scope.field.inequalitySignId !== 'undefined'));  
      } else {
        return true;
      }      
    };

    $scope.reset = function () {
        ctrl.initialize();

        $scope.form.$setPristine();
        $scope.form.$setUntouched();
        $state.forceReload();
    };

    $scope.ok = function() {
      // $state.forceReload();
      $modalInstance.close();
    };

    $scope.close = function () {
        // $state.forceReload();
        $modalInstance.dismiss('cancel');
    };

    $scope.delete = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/deletefieldmodal.html',
            controller: 'DeleteFieldModalInstanceCtrl',
            size: 'md',
            resolve: {
                thing: function() {
                    return {
                      fieldName: $scope.field.name,
                      type: 'field',
                    }   
                    // object { type: x, value: y } such that x ∈ ['field', 'log'] and y ∈ $scope.fields or $scope.dates
                },
                getCars: function() {
                    return (($scope.objectType === 'car') ? $scope.objects : {});
                },
                getDrivers: function() {
                    return (($scope.objectType === 'driver') ? $scope.objects : {});
                },
                getProspects: function() {
                    return (($scope.objectType === 'prospect') ? $scope.objects : {});
                },
                getAssets: function() {
                    return (($scope.objectType === 'prospect') ? $scope.objects : {});  
                },
                objectType: function() {
                  return $scope.objectType;
                }
            }
        });

        modalInstance.result.then(function () {
            $scope.ok();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    //
    // Prospect edit field stuff
    ////////////////////////////////////////////////////////////

    // $scope.statusChanged = false;
    // $scope.status = $scope.object.status.value;
    $scope.setStatusChanged = function(statusName) {
        var prospect = $scope.object;
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


  });