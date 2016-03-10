'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:EditexpressionmodalctrlCtrl
 * @description
 * # EditexpressionmodalctrlCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('EditExpressionModalCtrl', function ($modal, dataService, getDrivers, getAssets, getProspects, getCars, $modalInstance, $state, $scope, field, representativeObject, objectType, $q, carHelpers, driverHelpers, prospectHelpers, assetHelpers) {
    
    // INITIALIZE
    $scope.field = {};
    $scope.object = representativeObject;
    $scope.objects = [];
    angular.copy(representativeObject.data[field], $scope.field);
    $scope.field.expression = buildExpression2(representativeObject.data[field].expressionItems);
    $scope.field.name = field;
    $scope.functionFieldSelect = { value: null };
    $scope.functionConstantInput = { value: null };
    $scope.validFunction = true;
    $scope.expressionErrorMessage;
    var testExpression = '';
    angular.copy($scope.field.expression, testExpression);
    var testExpressionItems = buildTestExpressionItems(representativeObject.data[field].expressionItems);

    // console.log(testExpression);
    // console.log(testExpressionItems);

    setValidFieldsForExpressions(representativeObject.data);

    if(objectType === 'car') {
        // console.log('object type is car');
        $scope.update = carHelpers.updateCar;
        $scope.objects = getCars.data;
    } else if(objectType === 'driver') {
        $scope.update = driverHelpers.updateDriver;
        $scope.objects = getDrivers.data;
    } else if(objectType === 'prospect') {
        $scope.update = prospectHelpers.updateProspect;
        $scope.objects = getProspects.data;
    } else if (objectType === 'asset') {
        $scope.update = assetHelpers.updateAsset;
        $scope.objects = assetHelpers.getAssetsOfType(representativeObject.assetType).data;
    } else {
        alert('Unrecognized object type!');
    }

    function buildExpression2(expressionItems) {
        var expression = "";
        _.each(expressionItems, function(item) {
            expression = expression + item.value;
        });
        return expression;
    };

    /*
      Type of items     Additonal actions 
      -------------     -----------------
      operator          ?
      constant          none
      field             replace with 1 for testExpression
    */
    $scope.appendItemToFunction = function(item, typeOfItem) {
      $scope.field.expressionItems.push({ 
        type: typeOfItem, 
        value: item 
      });

      // append to testExpression
      if(typeOfItem === "field") {
        testExpressionItems.push('1');
      } else {
        testExpressionItems.push(item);
      }

      // set expression
      setAndValidateExpression();
      
      // resetting
      $scope.functionFieldSelect.value = null;
      $scope.functionConstantInput.value = null;
    };

    $scope.undoFunction = function() {
      if($scope.field.expressionItems.length) {
        var item = $scope.field.expressionItems[$scope.field.expressionItems.length-1];
        console.log('removed:', item);
        $scope.field.expressionItems.pop();
        testExpressionItems.pop();

        // build expression
        setAndValidateExpression();
      }
    };

    $scope.clearFunction = function() {
      testExpression = "";
      $scope.field.expression = "";
      $scope.field.expressionItems = [];
      testExpressionItems = [];
    };

    function setAndValidateExpression() {
      displayExpression().then(function(stuff) {
        testTheExpression().then(function(moreStuff) {
          $scope.validFunction = true;  
          validateExpression();
        });
      });
    };

    function testTheExpression() {
      var deferred = $q.defer();
      testExpression = "";
      // console.log(testExpressionItems);
      deferred.resolve(_.each(testExpressionItems, function(item) {
        // console.log(item.value);
        testExpression = testExpression + item;
      }));
      deferred.reject(new Error('Error getting test expression'));
      return deferred.promise;
    };

    function displayExpression() {
      var deferred = $q.defer();
      $scope.field.expression = "";
      deferred.resolve(_.each($scope.field.expressionItems, function(item) {
        // console.log(item.value);
        $scope.field.expression = $scope.field.expression + item.value;
      }));
      deferred.reject(new Error('Error getting display expression'));
      return deferred.promise;
    };

    function validateExpression() {
      $scope.expressionErrorMessage = undefined;

      try {
        mexp.eval(testExpression);
      } catch(e){
        console.error(e);
        $scope.validFunction = false;
        $scope.expressionErrorMessage = e.message;
      }

      // set $scope.validFunction
    };

    function buildTestExpressionItems(expressionItems) {
        var arr = [];
        _.each(expressionItems, function(item) {
            if(item.type === 'field') {
                arr.push('1');
            } else {
                arr.push(item.value);
            }
        });
        return arr;
    };

    $scope.submit = function() {

        if(field !== $scope.field.name) {
            // name changed
            _.each($scope.objects, function(object) {
                object.data[$scope.field.name] = $scope.field;
                delete object.data[field];
                evaluateExpression(object, $scope.field.name).then(function(objectToUpdate) {
                    $scope.update(objectToUpdate);
                });
            });
        } else {
            _.each($scope.objects, function(object) {
                object.data[field] = $scope.field;
                evaluateExpression(object, $scope.field.name).then(function(objectToUpdate) {
                    $scope.update(objectToUpdate);
                });
            });
        }

        $scope.ok();
    };

    $scope.reset = function () {
        $scope.field = {};
        angular.copy(representativeObject.data[field], $scope.field);
        $scope.field.expression = buildExpression(representativeObject.data[field].expressionItems);
        $scope.field.name = field;
        $scope.functionFieldSelect = { value: null };
        $scope.functionConstantInput = { value: null };
        $scope.validFunction = true;
        $scope.expressionErrorMessage;
        var testExpression = '';
        var testExpressionItems = [];
        angular.copy($scope.field.expression, testExpression);
        angular.copy($scope.field.expressionItems, testExpressionItems);

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

    function setValidFieldsForExpressions(objectData) {
        // only numbers
        // neglect the field in questions or else shit gets recursive
        // console.log(objectData);
        var keys = Object.keys(objectData);
        $scope.validFieldsForExpressions = _.filter(keys, function(key) {
            return ((objectData[key].dataType === 'number') && (key !== field));
        });
    };

    function evaluateExpression(object, fieldName) {
      var deferred = $q.defer();
      buildExpression(object, fieldName).then(function(expression) {
        var newObj = {};                    // this was the key to solving the problem where expression value
        angular.copy(object, newObj);       // for car 2 was being saved to both cars 2 and 3
        if(typeof parseFloat(mexp.eval(expression)) === 'number') {
            newObj.data[fieldName].value = mexp.eval(expression);
        } else {
            object.data[fieldName].value = undefined;
        }

        deferred.resolve(newObj);
        deferred.reject(new Error('Error evaluating expression'));
      });
      return deferred.promise;
    };

    // build expression
    function buildExpression(object, fieldName) {
        var deferred = $q.defer();
        var expression = "";

        _.each(object.data[fieldName].expressionItems, function(item) {
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
                    return ((objectType === 'car') ? dataService.getCars() : {});
                },
                getDrivers: function(dataService) {
                    return ((objectType === 'driver') ? dataService.getDrivers() : {});
                },
                getProspects: function(dataService) {
                    return ((objectType === 'prospect') ? dataService.getProspects() : {});
                },
                getAssets: function(dataService) {
                    return ((objectType === 'prospect') ? dataService.getProspects() : {});  
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
    }
  });
