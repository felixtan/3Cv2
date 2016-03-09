'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:EditexpressionmodalctrlCtrl
 * @description
 * # EditexpressionmodalctrlCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('EditExpressionModalCtrl', function ($modal, dataService, getDrivers, getAssets, getProspects, getCars, $modalInstance, $state, $scope, field, object, objectType, $q, carHelpers, driverHelpers, prospectHelpers, assetHelpers) {
    
    // INITIALIZE
    $scope.field = {};
    $scope.object = object;
    $scope.objects = [];
    angular.copy(object.data[field], $scope.field);
    $scope.field.expression = buildExpression2(object.data[field].expressionItems);
    $scope.field.name = field;
    $scope.functionFieldSelect = { value: null };
    $scope.functionConstantInput = { value: null };
    $scope.validFunction = true;
    $scope.expressionErrorMessage;
    var testExpression = '';
    angular.copy($scope.field.expression, testExpression);
    var testExpressionItems = buildTestExpressionItems(object.data[field].expressionItems);

    // console.log(testExpression);
    // console.log(testExpressionItems);

    setValidFieldsForExpressions(object.data);

    if(objectType === 'car') {
        // console.log('object type is car');
        $scope.update = carHelpers.updateCar;
        $scope.objects = getCars.data;
    } else if(objectType === 'driver') {

    } else if(objectType === 'prospect') {

    } else if (objectType === 'asset') {

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
        // console.log($scope.field);
        // console.log(object);
        if(field !== $scope.field.name) {
            // name changed
            _.each($scope.objects, function(object) {
                object.data[$scope.field.name] = $scope.field;
                delete object.data[field];
                evaluateExpression(object, object.data[$scope.field.name].expressionItems).then(function(expressionValue) {
                    object.data[$scope.field.name].value = expressionValue;
                    // console.log(object);
                    $scope.update(object);
                });
            });
        } else {
            _.each($scope.objects, function(object) {
                object.data[field] = $scope.field;
                evaluateExpression(object, object.data[field].expressionItems).then(function(expressionValue) {
                    object.data[field].value = expressionValue;
                    // console.log(object);
                    $scope.update(object);
                });
            });
        }

        $scope.ok();
    };

    $scope.reset = function () {
        $scope.field = {};
        angular.copy(object.data[field], $scope.field);
        $scope.field.expression = buildExpression(object.data[field].expressionItems);
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

    function evaluateExpression(object, expressionItems) {
      var deferred = $q.defer();
      var result;
      buildExpression(object, expressionItems).then(function(expression) {
          deferred.resolve(((typeof parseFloat(mexp.eval(expression)) === 'number') ? mexp.eval(expression) : null));
          deferred.reject(new Error('Error evaluating expression'));
      });
      return deferred.promise;
    };

    // build expression
    function buildExpression(object, expressionItems) {
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
