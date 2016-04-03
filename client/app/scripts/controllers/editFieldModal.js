'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:EditexpressionmodalctrlCtrl
 * @description
 * # EditexpressionmodalctrlCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('EditFieldModalCtrl', function ($modal, dataService, getDrivers, getAssets, getProspects, getCars, $modalInstance, $state, $scope, field, _object, objectType, $q, carHelpers, driverHelpers, prospectHelpers, assetHelpers) {
    
    var ctrl = this;

    $scope.setInequalitySign = function() {
      switch(parseInt($scope.field.inequalitySignId)) {
        case 0:
          // $scope.field.inequalitySign = '>';      // might want to use html codes instead
          $scope.field.inequalitySign = ">";
          // $scope.field.inequalitySignId = 0;
          break;
        case 1:
          $scope.field.inequalitySign = '≥';
          // $scope.field.inequalitySignId = 1;
          break;
        case 2:
          $scope.field.inequalitySign = '<';
          // $scope.field.inequalitySignId = 2;
          break;
        case 3:
          $scope.field.inequalitySign = '≤';
          // $scope.field.inequalitySignId = 3;
          break;
        default:
          $scope.field.inequalitySign = undefined;
          break;
      }
    };

    ctrl.updateExpressionFieldsIfFieldNameChanged = function (oldName, newName, object) {
      var deferred = $q.defer();

      if(oldName !== newName) {
        ctrl.replaceFieldNameInExpressions(oldName, newName, object.data).then(function(objectDataWithUpdatedExpressions) {
          _.each(objectDataWithUpdatedExpressions, function(data, field, list) {
            if(data.type === 'function') {
              ctrl.buildEvalExpressionv2(list, data.expressionItems, object.id).then(function(expression) {
                object.data[field].value = $scope.$eval(expression);
              });
            } else if(data.type === 'inequality') {
              ctrl.buildEvalExpressionv2(list, data.leftExpressionItems, object.id).then(function(leftExpression) {
                ctrl.buildEvalExpressionv2(list, data.rightExpressionItems, object.id).then(function(rightExpression) {
                  var inequalitySign = ctrl.getInequalitySign(data.inequalitySignId);
                  object.data[field].value = $scope.$eval(leftExpression+inequalitySign+rightExpression);
                });
              });
            }
          });
        });
      }

      deferred.resolve(object.data);
      deferred.reject(new Error("Error updating expressions"));
      return deferred.promise;
    };

    ctrl.replaceFieldNameInExpressions = function (oldName, newName, objectData) {
      var deferred = $q.defer();
  
      console.log('field name changed, checking if expressions should be updated');
      _.each(objectData, function(data, field, list) {
        if(data.type === 'function') {
          console.log(data);
          console.log(field);
          data.expression = _.each(data.expressionItems, function(item) {
            if(item.type === 'field' && item.value === oldName) item.value = newName;
          }).reduce(function(memo, item) {
            return memo + item.value;
          }, "");

          console.log('expression:', data.expression);
          console.log('expressionItems:', data.expressionItems);
        } else if(data.type === 'inequality') {
          console.log(data);
          console.log(field);
          var leftExpression = _.each(data.leftExpressionItems, function(item) {
            if(item.type === 'field' && item.value === oldName) item.value = newName;
          }).reduce(function(memo, item) {
            return memo + item.value;
          }, "");

          var rightExpression = _.each(data.rightExpressionItems, function(item) {
            if(item.type === 'field' && item.value === oldName) item.value = newName;
          }).reduce(function(memo, item) {
            return memo + item.value;
          }, "");

          var inequalitySign = ctrl.getInequalitySign(data.inequalitySignId);

          data.expression = leftExpression + inequalitySign + rightExpression; 

          console.log('expression:', data.expression);
          console.log('leftExpressionItems:', data.leftExpressionItems);
          console.log('rightExpressionItems:', data.rightExpressionItems);
        }
      });

      deferred.resolve(objectData);
      deferred.reject(new Error("Error replacing " + oldName + " with " + newName + " for expressions in " + $scope.objectType));
      return deferred.promise;
    }

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

    ctrl.evaluateExpressionAndAppendValue = function (object, fieldData) {
      var deferred = $q.defer(),
          newFieldData = {},
          inequalitySign = "";

                                                    // this was the key to solving the problem where expression value
      angular.copy(fieldData, newFieldData);       // for car 2 was being saved to both cars 2 and 3

      if($scope.field.type === 'function') {
        ctrl.buildEvalExpression(object, fieldData.expressionItems).then(function(expression) {
          // console.log(expression);
          newFieldData.value = $scope.$eval(expression);

          deferred.resolve(newFieldData);
          deferred.reject(new Error('Error evaluating expression'));
        });
      } else if($scope.field.type === 'inequality') {
        ctrl.buildEvalExpression(object, fieldData.leftExpressionItems).then(function(leftExpression) {
          ctrl.buildEvalExpression(object, fieldData.rightExpressionItems).then(function(rightExpression) {
            inequalitySign = ctrl.getInequalitySign(fieldData.inequalitySignId);                       
            
            // console.log(leftExpression + inequalitySign + rightExpression);
            newFieldData.value = $scope.$eval(leftExpression + inequalitySign + rightExpression);
            // newFieldData.leftExpressionItems = 

            deferred.resolve(newFieldData);
            deferred.reject(new Error('Error evaluating expression'));
          });
        });
      } else {
        deferred.resolve(newFieldData);
        deferred.reject(new Error('Error evaluating expression'));
      }
      
      return deferred.promise;
    };

    // build expression for $scope.$eval
    ctrl.buildEvalExpression = function(object, expressionItems) {
      var deferred = $q.defer(),
          expression = "";
      // console.log(fieldData);
      // console.log(expressionItems);
      _.each(expressionItems, function(item) {
        if(item.type === 'field') {
          // console.log(item);
          // console.log(object.data);
          // console.log(object.data[item.value]);
          // console.log(object.data[item.value].value);
          expression += object.data[item.value].value;
        } else {
          expression += item.value;          
        }
      });

      deferred.resolve(expression);
      deferred.reject(new Error('Error building expression'));
      return deferred.promise;
    };

    ctrl.buildEvalExpressionv2 = function(objectData, expressionItems, objectId) {
      var deferred = $q.defer(),
          expression = "";
      // console.log(fieldData);
      // console.log(expressionItems);
      _.each(expressionItems, function(item) {
        if(item.type === 'field' && item.value !== $scope.field.name) {
          expression += objectData[item.value].value;
        } else if(item.type === 'field' && item.value === $scope.field.name) {
          if($scope.object.id === objectId) {
            expression += $scope.field.value;  
          } else {
            // console.log(objectData);
            // console.log(item.value);
            // console.log(objectData[item.value]);
            expression += objectData[item.value].value;
          }
        } else {
          expression += item.value;
        }
      });

      deferred.resolve(expression);
      deferred.reject(new Error('Error building expression'));
      return deferred.promise;
    };

    // display (string only) expression
    ctrl.buildExpression = function(expressionItems) {
        var deferred = $q.defer(),
            expression = "";

        _.each(expressionItems, function(item) {
          expression += item.value
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
          return '>=';
          break;
        case 2:
          return '<';
          break;
        case 3:
          return '<=';
          break;
        default:
          return '?';
          break;
      }
    };

    ctrl.initDisplayExpression = function() {

        if($scope.field.type === 'function') {
            $scope.field.expression = "";
            _.each($scope.field.expressionItems, function(item) {
                // console.log(item);
                $scope.field.expression += item.value;
                // console.log($scope.field.expression);
            });
        } else if($scope.field.type === 'inequality') {
            $scope.field.leftExpression = "";
            _.each($scope.field.leftExpressionItems, function(item) {
                // console.log(item.value);
                $scope.field.leftExpression += item.value;
                // console.log($scope.field.leftExpression);
            });

            $scope.field.rightExpression = "";
            _.each($scope.field.rightExpressionItems, function(item) {
                // console.log(item.value);
                $scope.field.rightExpression += item.value;
                // console.log($scope.field.rightExpression);
            });

            $scope.setInequalitySign();
        }
    };

    ctrl.buildAndValidateExpression = function() {
      // console.log('building and validating');
      ctrl.displayExpression().then(function(expressionItems) {
        // console.log(expressionItems);
        ctrl.buildTestExpressionItems(expressionItems).then(function(testExpressionItems) {
          // console.log(testExpressionItems);
          ctrl.buildExpression(testExpressionItems).then(function(testExpression) {
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
        
        $scope.setInequalitySign();

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
        mexp.eval(testExpression);
      } catch(e){
        console.error(e);
        $scope.validExpression.value = false;
        $scope.expressionErrorMessage = e.message;
      }

      // set $scope.validExpression
    };

    ctrl.nothingChanged = function() {

    };

    // INITIALIZE
    ctrl.initialize = function() {
      $scope.field = {
          name: field,
          type: _object.data[field].type,
          dataType: _object.data[field].dataType,
          value: _object.data[field].value,
          log: _object.data[field].log,
          expression: null,
          expressionItems: null,
          leftExpression: null,
          leftExpressionItems: null,
          rightExpression: null,
          rightExpressionItems: null,
          inequalitySignId: null,
          inequalitySign: null,
          identifier: _object.identifier === field,
      };

      $scope.expressionFieldSelect = { value: null };
      $scope.expressionConstantInput = { value: null };
      $scope.validExpression = { value: true };
      $scope.expressionErrorMessage = null;
      $scope.rightSide = { value: false };
      $scope.object = _object;
      $scope.fields = _.without(Object.keys($scope.object.data), field);
      $scope.objects = [];
      $scope.objectType = objectType;

      if($scope.field.type === 'function') {
        $scope.field.expression = _object.data[field].expression;
        $scope.field.expressionItems = _object.data[field].expressionItems;
        ctrl.initDisplayExpression(); 
      } else if($scope.field.type === 'inequality') {
        $scope.field.leftExpressionItems = _object.data[field].leftExpressionItems;
        $scope.field.rightExpressionItems = _object.data[field].rightExpressionItems;
        $scope.field.inequalitySignId = _object.data[field].inequalitySignId;
        ctrl.initDisplayExpression(); 
      } else {
        // nada
      }
    };
    ctrl.initialize();
    ctrl.setValidFieldsForExpressions(_object.data);

    if(objectType === 'car') {
        // console.log('object type is car');
        $scope.update = carHelpers.updateCar;
        $scope.objects = getCars;
    } else if(objectType === 'driver') {
        $scope.update = driverHelpers.updateDriver;
        $scope.objects = getDrivers;
    } else if(objectType === 'prospect') {
        $scope.update = prospectHelpers.updateProspect;
        $scope.objects = getProspects;
    } else if (objectType === 'asset') {
        $scope.update = assetHelpers.updateAsset;
        // $scope.objects = assetHelpers.getAssetsOfType(_object.assetType);
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
        delete data.rightExpression;
        delete data.leftExpression;

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

    ctrl.appendExpressionToData = function(fieldData) {
      var deferred = $q.defer();

      if($scope.field.type === 'function') {
        ctrl.buildExpression($scope.field.expressionItems).then(function(expression) {
          fieldData.expression = expression;
        });
      } else if($scope.field.type === 'inequality') {
        ctrl.buildExpression($scope.field.leftExpressionItems).then(function(leftExpression) {
          ctrl.buildExpression($scope.field.rightExpressionItems).then(function(rightExpression) {
            var inequalitySign = ctrl.getInequalitySign($scope.field.inequalitySignId);
            fieldData.expression = leftExpression + inequalitySign + rightExpression;
          });
        });
      }

      deferred.resolve(fieldData);
      deferred.reject(new Error("Error appending expression to field data"));
      return deferred.promise;
    };

    $scope.submit = function() {
      console.log($scope.field);
      _.each($scope.objects, function(object) {
        console.log('1 field data:', object.data[field]);
          ctrl.appendExpressionToData(object.data[field]).then(function(withAppendedExpression) {
            console.log('2 field data:', withAppendedExpression);
            ctrl.pruneFieldData(withAppendedExpression).then(function() {
              ctrl.updateExpressionFieldsIfFieldNameChanged(field, $scope.field.name, object).then(function(objectDataWithUpdatedExpressions) {
                console.log('3  object data:', objectDataWithUpdatedExpressions);
                object.data = objectDataWithUpdatedExpressions;
                ctrl.evaluateExpressionAndAppendValue(object, withAppendedExpression).then(function(withValue) {
                  console.log('4 field data:', withValue);

                  // identifier changed?
                  if($scope.field.identifier) {
                    object.identifier = $scope.field.name;
                  }
                  
                  // field has expression?
                  if($scope.field.type === 'function' || $scope.field.type === 'inequality') {
                    object.data[$scope.field.name] = withValue;  
                  } 

                  // relevant car AND field has no expression?
                  if($scope.object.id === object.id && !($scope.field.type === 'function' || $scope.field.type === 'inequality')) {
                    console.log("this should only be called once");
                    withValue.value = $scope.field.value;
                  }

                  // name changed?
                  if(field !== $scope.field.name) {
                    object.data[$scope.field.name] = withValue;
                    delete object.data[field];
                  }

                  console.log(object);
                  $scope.update(object);
                });
              });
            });
          });
      });

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
        $state.forceReload();
        $modalInstance.dismiss('cancel');
    };

    $scope.delete = function (size, thing) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/deletefieldmodal.html',
            controller: 'DeleteFieldModalInstanceCtrl',
            size: size,
            resolve: {
                thing: function() {
                    return thing;   // object { type: x, value: y } such that x ∈ ['field', 'log'] and y ∈ $scope.fields or $scope.dates
                },
                getCars: function(dataService) {
                    return (($scope.objectType === 'car') ? $scope.objects : {});
                },
                getDrivers: function(dataService) {
                    return (($scope.objectType === 'driver') ? $scope.objects : {});
                },
                getProspects: function(dataService) {
                    return (($scope.objectType === 'prospect') ? $scope.objects : {});
                },
                getAssets: function(dataService) {
                    return (($scope.objectType === 'prospect') ? $scope.objects : {});  
                }
            }
        });

        modalInstance.result.then(function (input) {
            $scope.input = input;
            console.log('passed back from DeleteFieldModalInstanceCtrl:', input);
            $scope.ok();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });