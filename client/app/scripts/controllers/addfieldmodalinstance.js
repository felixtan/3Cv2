'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddfieldmodalinstanceCtrl
 * @description
 * # AddfieldmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddFieldModalInstanceCtrl', function (objectHelpers, assetType, objectType, $q, $state, getAssets, getCars, getDrivers, getProspects, $scope, $modalInstance, dataService) {

    var isValid = objectHelpers.isValid,
        buildEvalExpression = objectHelpers.buildEvalExpression;

    var ctrl = this;
    ctrl.update = null;
    ctrl.fields = [];
    ctrl.objects = [];
    ctrl.objectType = objectType;
    ctrl.assetType = assetType;

    $scope.formData = {};
    $scope.expressionFieldSelect = { value: null };
    $scope.expressionConstantInput = { value: null };
    
    // Expressions
    $scope.rightSide = { value: false };
    $scope.validExpression = { value: true };      // this will depend on results from mexp
    $scope.expressionErrorMessage = null;
    $scope.validFieldsForExpressions = [];

    ctrl.testExpressionItems = [];
    ctrl.testExpression = "";       // passed into mexp for validation, fields will be replaced with 1
    ctrl.rightTestExpressionItems = [];
    ctrl.leftTestExpressionItems = [];

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
      rightExpression: '',
    };

    ctrl.setValidFieldsForExpressions = function(objectData) {
        // only numbers
        // neglect the field in questions or else shit gets recursive
        // console.log(objectData);
        var keys = Object.keys(objectData);
        $scope.validFieldsForExpressions = _.filter(keys, function(key) {
            // console.log(objectData[key].dataType);
            return ((objectData[key].dataType === 'number'));
        });
    };

    $scope.setInequalitySign = function(signId) {
      switch(parseInt(signId)) {
        case 0:
          // $scope.field.inequalitySign = '>';      // might want to use html codes instead
          $scope.field.inequalitySign = ">";
          $scope.field.inequalitySignId = 0;
          break;
        case 1:
          $scope.field.inequalitySign = '≥';
          $scope.field.inequalitySignId = 1;
          break;
        case 2:
          $scope.field.inequalitySign = '<';
          $scope.field.inequalitySignId = 2;
          break;
        case 3:
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

      switch(field) {
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
        $scope.field.expressionItems.push({ type: typeOfItem, value: item, location: 'expressionItems' });
        _testExpressionItems_ = ctrl.testExpressionItems;
        // console.log(_testExpressionItems_);
      } else {
        if($scope.rightSide.value) {
          $scope.field.rightExpressionItems.push({ type: typeOfItem, value: item, location: 'rightExpressionItems' });
          _testExpressionItems_ = ctrl.rightTestExpressionItems;
        } else {
          $scope.field.leftExpressionItems.push({ type: typeOfItem, value: item, location: "leftExpressionItems" });
          _testExpressionItems_ = ctrl.leftTestExpressionItems;
        }
      }

      // validation
      ctrl.validate(_testExpressionItems_, typeOfItem, item);

      // console.log(ctrl.testExpression);
      // console.log(testExpressionItems);
      
      // resetting
      $scope.expressionFieldSelect.value = null;
      $scope.expressionConstantInput.value = null;
    };

    // see if can work with only _testExpressionItems_
    ctrl.validate = function(_testExpressionItems_, typeOfNewItem, newItem) {
      // console.log(_testExpressionItems_);
      // console.log(typeOfItem);
      // console.log(item);
      ctrl.firstStageValidation(_testExpressionItems_, typeOfNewItem, newItem).then(function(result1) {
        // console.log(result1);
        ctrl.displayExpression().then(function() {
          ctrl.buildTestExpression(result1._testExpressionItems_).then(function() {
            // console.log(mockTestExpression);
            if(result1.valid) {
              // call second stage
                // console.log(result1.valid);
                // console.log('testExpression:', ctrl.testExpression);
                $scope.validExpression.value = true;  
                ctrl.validateExpression();
            } else {  
              // don't call second stage
            }
          });
        });
      });
    };

    ctrl.firstStageValidation = function(_testExpressionItems_, typeOfItem, item) {
      var deferred = $q.defer();
      $scope.validExpression.value = true;

      if(_testExpressionItems_.length) {
        // validate before pushing
        if(typeOfItem === 'field' || typeOfItem === 'constant') {
          if(_testExpressionItems_[_testExpressionItems_.length-1].type !== 'operator') {
            // should fix 2mileage problem; not the first item and last item isnt an operator -> invalid
            _testExpressionItems_.push({ type: typeOfItem, value: item });    // this should render the expression invalid according to first stage validation
            $scope.validExpression.value = false;
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

      deferred.resolve({ _testExpressionItems_: _testExpressionItems_, valid: $scope.validExpression.value });
      deferred.reject(new Error('Error in first stage validation of expression'));
      return deferred.promise;
    };

    ctrl.validateExpression = function() {
      $scope.expressionErrorMessage = undefined;

      try {
        $scope.$eval(ctrl.testExpression);
      } catch(e){
        // console.error(e);
        $scope.validExpression.value = false;
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
        if($scope.rightSide.value) {
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
        item = $scope.field.expressionItems.pop();
      } else {
        if($scope.rightSide.value) {
          _testExpressionItems_ = ctrl.rightTestExpressionItems;
          item = $scope.field.rightExpressionItems.pop();
        } else {
          _testExpressionItems_ = ctrl.leftTestExpressionItems;
          item = $scope.field.leftExpressionItems.pop();
        }
      }

      _testExpressionItems_.pop();
      // console.log('removed:', item);
      
      ctrl.firstStageValidate_Undo().then(function(validExpression) {
        ctrl.displayExpression().then(function() {
          ctrl.buildTestExpression(_testExpressionItems_).then(function() {
            // console.log(mockTestExpression);
            if(validExpression) {
              // call second stage
                // console.log('testExpression:', ctrl.testExpression);
                $scope.validExpression.value = true;  
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
        if($scope.rightSide.value) {
          _testExpressionItems_ = ctrl.rightTestExpressionItems;
        } else {
          _testExpressionItems_ = ctrl.leftTestExpressionItems;
        }
      }
       
      $scope.validExpression.value = true;
      if(_testExpressionItems_.length > 1) {
        lastItem = _testExpressionItems_[_testExpressionItems_.length-1]; 
        if(lastItem.type === 'field' || lastItem.type === 'constant') {
          var previousItem = _testExpressionItems_[_testExpressionItems_.length-2];
          if(previousItem.type !== 'operator') {
            $scope.validExpression.value = false;
            $scope.expressionErrorMessage = "Missing operator before " + previousItem.type + " " + previousItem.value;
          }
        }  
      }

      deferred.resolve($scope.validExpression.value);
      deferred.reject(new Error('Error during first stage validation after undo'));
      return deferred.promise;
    };

    $scope.clearExpression = function() {
      ctrl.testExpression = "";
      ctrl.testExpressionItems = [];
      ctrl.leftTestExpressionItems = [];
      ctrl.rightTestExpressionItems = [];

      $scope.field.expression = "";
      $scope.field.expressionItems = [];
      $scope.field.leftExpressionItems = [];
      $scope.field.leftExpression = "";
      $scope.field.rightExpressionItems = [];
      $scope.field.rightExpression = "";
      $scope.field.inequalitySign = "";
      $scope.field.inequalitySignId = null;
      $scope.validExpression.value = true;
      $scope.expressionErrorMessage = undefined;
    };

    if(objectType === 'car') {
      // console.log("add field modal called from carProfile");
      ctrl.update = dataService.updateCar;
      if(typeof getCars !== 'undefined' && getCars.length > 0) ctrl.objects = getCars;
    } else if(objectType === 'driver') {
      // console.log("add field modal called from driverProfile");
      ctrl.update = dataService.updateDriver;
      if(typeof getDrivers !== 'undefined' && getDrivers.length > 0) ctrl.objects = getDrivers;
    } else if(objectType === 'prospect') {
      // console.log("add field modal called from prospectProfile");
      ctrl.update = dataService.updateProspect;
      if(typeof getProspects !== 'undefined' && getProspects.length > 0) ctrl.objects = getProspects;
    } else if(objectType === 'asset') {
      // console.log("add field modal called from assetProfile");
      ctrl.update = dataService.updateAsset;
      
      var assetsOfType = _.filter(getAssets, function(asset) { 
        // console.log(asset.assetType);
        // console.log(ctrl.assetType);
        return asset.assetType === ctrl.assetType; 
      });

      if(assetsOfType !== 'undefined' && assetsOfType.length > 0) ctrl.objects = assetsOfType;
    } else {
      $state.go('dashboard.cars');
    }

    //
    // General post-processing regardless of object
    ////////////////////////////////////////////////
    if(ctrl.objects.length > 0) {
      ctrl.fields = Object.keys(ctrl.objects[0].data);
      ctrl.setValidFieldsForExpressions(ctrl.objects[0].data); 
    }
    ////////////////////////////////////////////

    $scope.fieldNameAlreadyExists = function () {
      return _.contains(ctrl.fields, $scope.field.name);
    };

    ctrl.createNewFieldData = function(field) {
      var deferred = $q.defer();

      if(field.type === 'function') {
        deferred.resolve({
          value: null,
          log: $scope.formData.log || false,
          dataType: field.dataType,
          type: field.type,
          expressionItems: field.expressionItems,
          expression: field.expression,
          fieldsUsed: {},
          expressionsUsedIn: {},
        });
      } else if(field.type === 'inequality') {
        deferred.resolve({
          value: null,
          log: $scope.formData.log || false,
          dataType: field.dataType,
          type: field.type,
          leftExpressionItems: field.leftExpressionItems,
          rightExpressionItems: field.rightExpressionItems,
          inequalitySignId: field.inequalitySignId,
          leftExpression: field.leftExpression,
          rightExpression: field.rightExpression,
          inequalitySign: objectHelpers.getInequalitySign(field.inequalitySignId),
          fieldsUsed: {},
        });
      } else {
        deferred.resolve({
          value: null,
          log: $scope.formData.log || false,
          dataType: field.dataType,
          type: field.type,
          expressionsUsedIn: field.type === 'number' ? {} : undefined,
        });
      }
      
      deferred.reject(new Error('Error creating new field data'));
      return deferred.promise;
    };

    ctrl.appendNewFieldToObject = function(fieldName, fieldDataObj, object) {
      object.data[fieldName] = fieldDataObj;
      return object;
    };

    ctrl.evaluateInequalityValue = function(leftExpressionValue, rightExpressionValue) {
      if($scope.field.inequalitySignId === 0) {
        console.log(leftExpressionValue + ' > ' + rightExpressionValue);
        return leftExpressionValue > rightExpressionValue;
      } else if ($scope.field.inequalitySignId === 1) {
        // console.log(leftExpressionValue + ' >= ' + rightExpressionValue);
        return leftExpressionValue >= rightExpressionValue;
      } else if ($scope.field.inequalitySignId === 2) {
        // console.log(leftExpressionValue + ' < ' + rightExpressionValue);
        return leftExpressionValue < rightExpressionValue;
      } else if ($scope.field.inequalitySignId === 3) {
        // console.log(leftExpressionValue + ' <= ' + rightExpressionValue);
        return leftExpressionValue <= rightExpressionValue;
      } else {
        return undefined;
        // throw "Error: Invalid inequality sign id";
      }
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
        return (($scope.field.rightExpressionItems.length > 0) && ($scope.field.leftExpressionItems.length > 0) && ($scope.field.inequalitySignId !== null) && (typeof $scope.field.inequalitySignId !== 'undefined'));  
      } else {
        return true;
      }      
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

    $scope.submit = function() {
      // ctrl.updateObjects().then(function() {
        // console.log(updatedObjects);
        // $scope.ok($scope.field);
      // });

      ctrl.createNewFieldData($scope.field).then(function(fieldDataObj) {
        if(ctrl.objects.length > 0) {
          if($scope.field.type === 'function') {
            _.each(ctrl.objects, function(object) {
              ctrl.evaluateExpression(object, $scope.field.expressionItems).then(function(expressionValue) {
                // console.log(expressionValue);
                  fieldDataObj.value = expressionValue;
                  var objectv2 = ctrl.appendNewFieldToObject($scope.field.name, fieldDataObj, object);
                  // console.log('object after appending field:', objectv2);
                  objectHelpers.storeFieldsUsed(objectv2, $scope.field.name).then(function(objectv3) {
                    // console.log(objectv3);
                    ctrl.update(objectv3);
                  });
              });
            });
          } else if($scope.field.type === 'inequality') {
            _.each(ctrl.objects, function(object) {
              ctrl.evaluateExpression(object, $scope.field.leftExpressionItems).then(function(leftExpressionValue) {
                ctrl.evaluateExpression(object, $scope.field.rightExpressionItems).then(function(rightExpressionValue) {
                  leftExpressionValue = parseFloat(leftExpressionValue);
                  rightExpressionValue = parseFloat(rightExpressionValue);
                  fieldDataObj.value = ctrl.evaluateInequalityValue(leftExpressionValue, rightExpressionValue);
                  var objectv2 = ctrl.appendNewFieldToObject($scope.field.name, fieldDataObj, object);
                  objectHelpers.storeFieldsUsed(objectv2, $scope.field.name).then(function(objectv3) {
                    // console.log(objectv3);
                    ctrl.update(objectv3);
                  });
                });
              });
            });
          } else {
            _.each(ctrl.objects, function(object) {
              var objectToUpdate = ctrl.appendNewFieldToObject($scope.field.name, fieldDataObj, object);
              ctrl.update(objectToUpdate);
            });
          }
        }

        $scope.ok(fieldDataObj, $scope.field.name);
      });
    };

    $scope.reset = function () {
      $scope.formData = {};
      $scope.form.$setPristine();
      $scope.form.$setUntouched();
      $state.forceReload();
    };

    $scope.ok = function(newFieldObject, newFieldName) {
      $state.forceReload();
      $modalInstance.close({
        name: newFieldName,
        data: newFieldObject,
      });
    };

    $scope.close = function () {
        $state.forceReload();
        $modalInstance.dismiss('cancel');
    };

    // evaluate expression
    ctrl.evaluateExpression = function(object, expressionItems) {
      var deferred = $q.defer();
      buildEvalExpression(object.data, expressionItems).then(function(expression) {
          // console.log(expression);
          // console.log($scope.$eval(expression));
          // return ((typeof parseFloat($scope.$eval(expression)) === 'number') ? $scope.$eval(expression) : null);
          // result = ((typeof parseFloat($scope.$eval(expression)) === 'number') ? $scope.$eval(expression) : null);
          deferred.resolve(isValid($scope.$eval(expression)) ? $scope.$eval(expression) : null);
          deferred.reject(new Error('Error evaluating expression'));
      });

      // deferred.resolve(result);
      // deferred.reject(new Error('Error evaluating expression'));
      return deferred.promise;
    };
  });
