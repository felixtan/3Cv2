'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddfieldmodalinstanceCtrl
 * @description
 * # AddfieldmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddFieldModalInstanceCtrl', function ($q, $state, getAssets, getCars, getDrivers, getProspects, $scope, $modalInstance, dataService) {
    
    var ctrl = this;
    $scope.formData = {};
    $scope.objects = [];
    $scope.objectType = null;
    $scope.assetType = null;
    $scope.update = function(object) { return; };
    $scope.fields = [];
    $scope.functionFieldSelect = { value: null };
    $scope.functionConstantInput = { value: null };

    // Inequalities
    $scope.rightSide = false;

    ctrl.testExpressionItems = [];
    $scope.validExpression = true;      // this will depend on results from mexp
    ctrl.testExpression = "";       // passed into mexp for validation, fields will be replaced with 1
    $scope.expressionErrorMessage;
    ctrl.rightTestExpressionItems = [];
    ctrl.leftTestExpressionItems = [];

    ctrl.setValidFieldsForExpressions = function(objectData) {
        // only numbers
        // neglect the field in questions or else shit gets recursive
        // console.log(objectData);
        var keys = Object.keys(objectData);
        $scope.validFieldsForExpressions = _.filter(keys, function(key) {
            return ((objectData[key].dataType === 'number'));
        });
    };

    /*
      Type of field     Data type 
      -------------     ---------
      text              text
      number            number
      boolean           boolean
      function          number
      inequality        boolean
    */

    $scope.field = {  // when this value changes, the UI dynamically changes
      name: null,
      type: null,
      dataType: null,
      expressionItems: [],
      expression: '',
      inequalitySign: '',             // for displaying the inequality to client
      inequalitySignId: null,
      leftExpressionItems: [],
      leftExpression: '',
      rightExpressionItems: [],
      rightExpression: ''
    };

    $scope.setInequalitySign = function(signId) {
      switch(signId) {
        case '0':
          // $scope.field.inequalitySign = '>';      // might want to use html codes instead
          $scope.field.inequalitySign = ">";
          $scope.field.inequalitySignId = 0;
          break;
        case '1':
          $scope.field.inequalitySign = '≥';
          $scope.field.inequalitySignId = 1;
          break;
        case '2':
          $scope.field.inequalitySign = '<';
          $scope.field.inequalitySignId = 2;
          break;
        case '3':
          $scope.field.inequalitySign = '≤';
          $scope.field.inequalitySignId = 3;
          break;
        default:
          $scope.field.inequalitySign = undefined;
          break;
      }
    };

    $scope.setDataType = function(field) {
      $scope.clearExpression();
      switch(field.type) {
        case "text":
          $scope.field.dataType = "text";
          break;
        case "number":
          $scope.field.dataType = "number";
          break;
        case "boolean":
          $scope.field.dataType = "boolean";
          break;
        case "function":
          $scope.field.dataType = "number";
          break;
        case "inequality":
          $scope.field.dataType = "boolean";
          break;
        default:
          $scope.field.dataType = undefined;
          break;
      }
    };

    $scope.invalidFieldType = function() {
      return (($scope.field.type === null) || (typeof $scope.field.type === 'undefined') || ($scope.field.dataType === null) || (typeof $scope.field.dataType === 'undefined'));
    };

    /*
      Type of items     Additonal actions 
      -------------     -----------------
      operator          ?
      constant          none
      field             replace with 1 for testExpression
    */
    $scope.appendItemToFunction = function(item, typeOfItem) {
      var _testExpressionItems_ = [];

      if($scope.field.type === 'function') {
        $scope.field.expressionItems.push({ type: typeOfItem, value: item });
        _testExpressionItems_ = ctrl.testExpressionItems;
      } else {
        if($scope.rightSide) {
          $scope.field.rightExpressionItems.push({ type: typeOfItem, value: item });
          _testExpressionItems_ = ctrl.rightTestExpressionItems;
        } else {
          $scope.field.leftExpressionItems.push({ type: typeOfItem, value: item });
          _testExpressionItems_ = ctrl.leftTestExpressionItems;
        }
      }

      // validation
      ctrl.validate(_testExpressionItems_, typeOfItem, item);

      // console.log(ctrl.testExpression);
      // console.log(testExpressionItems);
      
      // resetting
      $scope.functionFieldSelect.value = null;
      $scope.functionConstantInput.value = null;
    }

    ctrl.validate = function(_testExpressionItems_, typeOfItem, item) {
      ctrl.firstStageValidation(_testExpressionItems_, typeOfItem, item).then(function(result1) {
        console.log(result1);
        ctrl.displayExpression().then(function(expressionItems) {
          ctrl.buildTestExpression(result1._testExpressionItems_).then(function(mockTestExpression) {
            console.log(mockTestExpression);
            if(result1.valid) {
              // call second stage
                console.log('testExpression:', ctrl.testExpression);
                $scope.validExpression = true;  
                ctrl.validateExpression();
            } else {  
              // don't call second stage
            }
          });
        });
      });
    }

    ctrl.firstStageValidation = function(_testExpressionItems_, typeOfItem, item) {
      var deferred = $q.defer();
      // var _testExpressionItems_;
      $scope.validExpression = true;

      // if($scope.field.type === 'function') {
      //   _testExpressionItems_ = testExpressionItems;
      // } else {
      //   if($scope.rightSide) {
      //     _testExpressionItems_ = ctrl.rightTestExpressionItems;
      //   } else {
      //     _testExpressionItems_ = ctrl.leftTestExpressionItems;
      //   }
      // }

      if(_testExpressionItems_.length) {
        // validate before pushing
        if(typeOfItem === 'field' || typeOfItem === 'constant') {
          if(_testExpressionItems_[_testExpressionItems_.length-1].type !== 'operator') {
            // should fix 2mileage problem; not the first item and last item isnt an operator -> invalid
            _testExpressionItems_.push({ type: typeOfItem, value: item });    // this should render the expression invalid according to first stage validation
            $scope.validExpression = false;
            $scope.expressionErrorMessage = "Missing operator before " + typeOfItem + " " + item;
          } else {
            // not the first item and last item is an operator -> ok
            if(typeOfItem === 'field') {
              _testExpressionItems_.push({ type: typeOfItem, value: '1' });  
            } else {
              // it's a constant
              _testExpressionItems_.push({ type: typeOfItem, value: item });  
            }
          }
        } else {
          // it's an operator -> ok
          _testExpressionItems_.push({ type: typeOfItem, value: item });
        }
      } else {
        if(typeOfItem === 'field') {
          _testExpressionItems_.push({ type: typeOfItem, value: '1' });  
        } else {
          _testExpressionItems_.push({ type: typeOfItem, value: item });  
        }
      }

      deferred.resolve({ _testExpressionItems_: _testExpressionItems_, valid: $scope.validExpression });
      deferred.reject(new Error('Error in first stage validation of expression'));
      return deferred.promise;
    }

    ctrl.validateExpression = function() {
      $scope.expressionErrorMessage = undefined;

      try {
        $scope.$eval(ctrl.testExpression);
      } catch(e){
        console.error(e);
        $scope.validExpression = false;
        $scope.expressionErrorMessage = e.message;
      }
    };

    ctrl.buildTestExpression = function(_testExpressionItems_) {
      var deferred = $q.defer();
      ctrl.testExpression = "";
      _.each(_testExpressionItems_, function(item) {
        // console.log(item.value);
        ctrl.testExpression = ctrl.testExpression + item.value;
      });
      deferred.resolve(ctrl.testExpression);
      deferred.reject(new Error('Error building test expression'));
      return deferred.promise;
    };

    ctrl.displayExpression = function() {
      var deferred = $q.defer();

      if($scope.field.type === 'function') {
        $scope.field.expression = "";
        deferred.resolve(_.each($scope.field.expressionItems, function(item) {
          $scope.field.expression = $scope.field.expression + item.value;
        }));
      } else {
        if($scope.rightSide) {
          $scope.field.rightExpression = "";
          deferred.resolve(_.each($scope.field.rightExpressionItems, function(item) {
            $scope.field.rightExpression += item.value;
          }));
        } else {
          $scope.field.leftExpression = "";
          deferred.resolve(_.each($scope.field.leftExpressionItems, function(item) {
            $scope.field.leftExpression += item.value;
          }));
        }
      }

      deferred.reject(new Error('Error getting display expression'));
      return deferred.promise;
    };

    $scope.undoExpression = function() {
      var item = {};
      var _testExpressionItems_ = [];

      if($scope.field.type === 'function') {
        _testExpressionItems_ = ctrl.testExpressionItems;
        if($scope.field.expressionItems.length) {
          item = $scope.field.expressionItems.pop();
        }
      } else {
        if($scope.rightSide) {
          _testExpressionItems_ = ctrl.rightTestExpressionItems;
          if($scope.field.rightExpressionItems.length) {
            item = $scope.field.rightExpressionItems.pop();
          }
        } else {
          _testExpressionItems_ = ctrl.leftTestExpressionItems;
          if($scope.field.leftExpressionItems.length) {
            // console.log('removing left');
            // console.log($scope.field.leftExpressionItems);
            item = $scope.field.leftExpressionItems.pop();
          }
        }
      }

      _testExpressionItems_.pop();
      console.log('removed:', item);
      
      ctrl.firstStageValidate_Undo().then(function(validExpression) {
        ctrl.displayExpression().then(function(expressionItems) {
          ctrl.buildTestExpression(_testExpressionItems_).then(function(mockTestExpression) {
            console.log(mockTestExpression);
            if(validExpression) {
              // call second stage
                console.log('testExpression:', ctrl.testExpression);
                $scope.validExpression = true;  
                ctrl.validateExpression();
            } else {  
              // don't call second stage
            }
          });
        });
      });
    };

    ctrl.firstStageValidate_Undo = function() {
      var deferred = $q.defer();
      var lastItem; 
      var _testExpressionItems_ = [];

      if($scope.field.type === 'function') {
          _testExpressionItems_ = ctrl.testExpressionItems;        
      } else {
        if($scope.rightSide) {
          _testExpressionItems_ = ctrl.rightTestExpressionItems;
        } else {
          _testExpressionItems_ = ctrl.leftTestExpressionItems;
        }
      }
       
      lastItem = _testExpressionItems_[_testExpressionItems_.length-1]; 
      $scope.validExpression = true;
      if(_testExpressionItems_.length > 1) {
        if(lastItem.type === 'field' || lastItem.type === 'constant') {
          var previousItem = _testExpressionItems_[_testExpressionItems_.length-2];
          if(previousItem.type !== 'operator') {
            $scope.validExpression = false;
            $scope.expressionErrorMessage = "Missing operator before " + previousItem.type + " " + previousItem.value;
          }
        }  
      }

      deferred.resolve($scope.validExpression);
      deferred.reject(new Error('Error during first stage validation after undo'));
      return deferred.promise;
    }

    $scope.clearExpression = function() {
      ctrl.testExpression = "";
      $scope.field.expression = "";
      $scope.field.expressionItems = [];
      ctrl.testExpressionItems = [];
      $scope.field.leftExpressionItems = [];
      $scope.field.leftExpression = "";
      $scope.field.rightExpressionItems = [];
      $scope.field.rightExpression = "";
      $scope.field.inequalitySign = "";
      $scope.field.inequalitySignId = null;
      $scope.validExpression = true;
      $scope.expressionErrorMessage = undefined;
    };

    if($state.includes('carProfile') || $state.includes('dashboard.cars')) {
      // console.log("add field modal called from carProfile");
      $scope.objects = getCars.data;
      $scope.objectType = 'car';
      $scope.update = dataService.updateCar;
    } else if($state.includes('driverProfile') || $state.includes('dashboard.drivers')) {
      // console.log("add field modal called from driverProfile");
      $scope.objects = getDrivers.data;
      $scope.objectType = 'driver';
      $scope.update = dataService.updateDriver;
    } else if($state.includes('prospectProfile') || $state.includes('dashboard.prospects')) {
      // console.log("add field modal called from prospectProfile");
      $scope.objects = getProspects.data;
      $scope.objectType = 'prospect';
      $scope.update = dataService.updateProspect;
    } else if($state.includes('assetProfile') || $state.includes('dashboard.assets')) {
      // console.log("add field modal called from assetProfile");
      $scope.assetType = getAssets.type;
      $scope.objects = _.filter(getAssets.data, function(asset) { return asset.assetType === $scope.assetType; });
      $scope.objectType = 'asset';
      $scope.update = dataService.updateAsset;
    } else {
      console.log('add field modal called from invalid state', $state.current);
    }

    // General post-processing regardless of object
    $scope.fields = $scope.objects[0] ? (Object.keys($scope.objects[0].data)) : [];
    if($scope.objects[0]) ctrl.setValidFieldsForExpressions($scope.objects[0].data);

    ctrl.createNewFieldData = function(field) {
      var deferred = $q.defer();

      if(field.type === 'function') {
        deferred.resolve({
          value: null,
          log: $scope.formData.log || false,
          dataType: field.dataType,
          type: field.type,
          expressionItems: field.expressionItems
        });
      } else if(field.type === 'inequality') {
        deferred.resolve({
          value: null,
          log: $scope.formData.log || false,
          dataType: field.dataType,
          type: field.type,
          leftExpressionItems: field.leftExpressionItems,
          rightExpressionItems: field.rightExpressionItems,
          inequalitySignId: field.inequalitySignId
        });
      }
      
      deferred.reject(new Error('Error creating new field data'));
      return deferred.promise;
    };

    ctrl.appendNewFieldToObject = function(fieldName, fieldDataObj, object) {
      var deferred = $q.defer();
      // console.log(fieldName);
      // console.log(fieldDataObj);
      object.data[fieldName] = fieldDataObj;
      deferred.resolve(object);
      deferred.reject(new Error('Error updating object'));
      return deferred.promise;
    };

    ctrl.updateObjects = function() {
      var deferred = $q.defer();
    
      if($scope.field.type === 'function') {
        deferred.resolve(_.each($scope.objects, function(object) {
          ctrl.evaluateExpression(object, $scope.field.expressionItems).then(function(expressionValue) {
            // console.log(expressionVal);
            ctrl.createNewFieldData($scope.field).then(function(fieldDataObj) {
              fieldDataObj.value = expressionValue;
              ctrl.appendNewFieldToObject($scope.field.name, fieldDataObj, object).then(function(objectToUpdate) {
                // console.log('object to update:', objectToUpdate);
                $scope.update(objectToUpdate).then(function(whatever) {
                  $state.forceReload();
                });
              });
            });
          });
        }));
      } else if($scope.field.type === 'inequality') {
        deferred.resolve(_.each($scope.objects, function(object) {
          ctrl.evaluateExpression(object, $scope.field.leftExpressionItems).then(function(leftExpressionValue) {
            ctrl.evaluateExpression(object, $scope.field.rightExpressionItems).then(function(rightExpressionValue) {
              ctrl.createNewFieldData($scope.field).then(function(fieldDataObj) {

                leftExpressionValue = parseFloat(leftExpressionValue);
                rightExpressionValue = parseFloat(rightExpressionValue);

                if($scope.field.inequalitySignId === 0) {
                  console.log(leftExpressionValue + ' > ' + rightExpressionValue);
                  fieldDataObj.value = (leftExpressionValue > rightExpressionValue) ? true : false;
                } else if ($scope.field.inequalitySignId === 1) {
                  console.log(leftExpressionValue + ' >= ' + rightExpressionValue);
                  fieldDataObj.value = (leftExpressionValue >= rightExpressionValue) ? true : false;
                } else if ($scope.field.inequalitySignId === 2) {
                  console.log(leftExpressionValue + ' < ' + rightExpressionValue);
                  fieldDataObj.value = (leftExpressionValue < rightExpressionValue) ? true : false;
                } else if ($scope.field.inequalitySignId === 3) {
                  console.log(leftExpressionValue + ' <= ' + rightExpressionValue);
                  fieldDataObj.value = (leftExpressionValue <= rightExpressionValue) ? true : false;
                } else {
                  fieldDataObj.value = undefined;
                  throw "Error: Invalid inequality sign id";
                }

                ctrl.appendNewFieldToObject($scope.field.name, fieldDataObj, object).then(function(objectToUpdate) {
                  $scope.update(objectToUpdate).then(function() {
                    $state.forceReload();
                  });
                });
              });
            });
          });
        }));
      }

      deferred.reject(new Error('Error updating objects'));
      return deferred.promise;
    };

    $scope.inequalityIsComplete = function() {
      /* conditions 
        1. rightExpressionItems.length > 1  
        2. rightExpression is valid
        3. leftExpressionItems.length > 1  
        4. leftExpression is valid
        5. inequalitySign is not null or undefined
      */

      // 2 and 3 are handled during expression creation so here
      // we just handle 1, 4, 5
      if($scope.field.type === 'inequality') {
        return (($scope.field.rightExpressionItems.length) 
          && ($scope.field.leftExpressionItems.length) 
          && ($scope.field.inequalitySign !== null) 
          && (typeof $scope.field.inequalitySign !== 'undefined'));  
      } else {
        return true;
      }

      
    };

    $scope.submit = function() {
      ctrl.updateObjects().then(function(updatedObjects) {
        // console.log(updatedObjects);
        $scope.ok($scope.field);
      });
    };

    $scope.reset = function () {
      $scope.formData = {};
      $scope.form.$setPristine();
      $scope.form.$setUntouched();
      $state.forceReload();
    };

    $scope.ok = function(newFieldObj) {
      $state.forceReload();
      $modalInstance.close(newFieldObj);
    };

    $scope.close = function () {
        $state.forceReload();
        $modalInstance.dismiss('cancel');
    };

    // build expression
    ctrl.buildExpression = function(object, expressionItems) {
        var deferred = $q.defer();
        var expression = "";

        _.each(expressionItems, function(item) {
            if(item.type === 'field') {
                expression += object.data[item.value].value;
            } else {
                expression += item.value;
            }
        });

        deferred.resolve(expression);
        deferred.reject(new Error('Error building expression'));
        return deferred.promise;
    };

    // evaluate expression
    ctrl.evaluateExpression = function(object, expressionItems) {
      var deferred = $q.defer();
      var result;
      ctrl.buildExpression(object, expressionItems).then(function(expression) {
          // console.log(expression);
          // console.log($scope.$eval(expression));
          // return ((typeof parseFloat($scope.$eval(expression)) === 'number') ? $scope.$eval(expression) : null);
          // result = ((typeof parseFloat($scope.$eval(expression)) === 'number') ? $scope.$eval(expression) : null);
          deferred.resolve(((typeof parseFloat($scope.$eval(expression)) === 'number') ? $scope.$eval(expression) : null));
          deferred.reject(new Error('Error evaluating expression'));
      });

      // deferred.resolve(result);
      // deferred.reject(new Error('Error evaluating expression'));
      return deferred.promise;
    };
  });
