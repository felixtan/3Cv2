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
    
    // var mexp = 
    $scope.formData = {};
    $scope.objects = [];
    $scope.objectType = null;
    $scope.assetType = null;
    $scope.update = function(object) { return; };
    $scope.fields = [];
    $scope.functionFieldSelect = { value: null };
    $scope.functionConstantInput = { value: null };

    var testExpressionItems = [];
    $scope.validFunction = true;      // this will depend on results from mexp
    var testExpression = "";       // passed into mexp for validation, fields will be replaced with 1
    $scope.expressionErrorMessage;
    
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

    // function buildExpression() {
    //   testExpression = testExpressionItems.join('');
    //   $scope.field.expression = "";
    //   _.each($scope.field.expressionItems, function(item) {
    //     $scope.field.expression = $scope.field.expression + item.value;
    //   });
    //   $scope.validFunction = true;
    //   validateExpression();
    // };

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
      expression: ''
    };

    $scope.setDataType = function(field) {
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

      // console.log(testExpression);
      // console.log(testExpressionItems);
      
      // resetting
      $scope.functionFieldSelect.value = null;
      $scope.functionConstantInput.value = null;
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
    if($scope.objects[0]) setValidFieldsForExpressions($scope.objects[0].data);

    function createNewFieldData(field) {
      var deferred = $q.defer();
      deferred.resolve({
        value: null,
        log: $scope.formData.log || false,
        dataType: field.dataType,
        type: field.type,
        expressionItems: ((field.type === 'function' || field.type === 'inequality') ? field.expressionItems : undefined)
      });
      deferred.reject(new Error('Error creating new field data'));
      return deferred.promise;
    };

    function appendNewFieldToObject(fieldName, fieldDataObj, object) {
      var deferred = $q.defer();
      // console.log(fieldName);
      // console.log(fieldDataObj);
      object.data[fieldName] = fieldDataObj;
      deferred.resolve(object);
      deferred.reject(new Error('Error updating object'));
      return deferred.promise;
    };

    function updateObjects() {
      var deferred = $q.defer();
    
      deferred.resolve(_.each($scope.objects, function(object) {
        evaluateExpression(object, $scope.field.expressionItems).then(function(expressionValue) {
          // console.log(expressionVal);
          createNewFieldData($scope.field).then(function(fieldDataObj) {
            fieldDataObj.value = expressionValue;
            appendNewFieldToObject($scope.field.name, fieldDataObj, object).then(function(objectToUpdate) {
              // console.log('object to update:', objectToUpdate);
              $scope.update(objectToUpdate).then(function(whatever) {
                $state.forceReload();
              });
            });
          });
        });
      }));
      deferred.reject(new Error('Error updating objects'));
      return deferred.promise;
    };

    $scope.submit = function() {

      /*
        For each
        1. create field data
            - evaluate expression and provide value IF ALL field values are valid
        2. append to object
        3. update object
      */

      updateObjects().then(function(updatedObjects) {
        // console.log(updatedObjects);
        $scope.ok($scope.field);
      });

      // works
      // createNewFieldData($scope.field).then(function(fieldDataObj) {
      //   appendNewFieldDataToEachObject($scope.field.name, fieldDataObj).then(function(objectsToUpdate) {
      //     updateObjects(objectsToUpdate).then(function(updatedObjects) {
      //       $scope.ok($scope.field.name);
      //     });
      //   });
      // });
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

    // evaluate expression
    function evaluateExpression(object, expressionItems) {
      var deferred = $q.defer();
      var result;
      buildExpression(object, expressionItems).then(function(expression) {
          // console.log(expression);
          // console.log(mexp.eval(expression));
          // return ((typeof parseFloat(mexp.eval(expression)) === 'number') ? mexp.eval(expression) : null);
          // result = ((typeof parseFloat(mexp.eval(expression)) === 'number') ? mexp.eval(expression) : null);
          deferred.resolve(((typeof parseFloat(mexp.eval(expression)) === 'number') ? mexp.eval(expression) : null));
          deferred.reject(new Error('Error evaluating expression'));
      });

      // deferred.resolve(result);
      // deferred.reject(new Error('Error evaluating expression'));
      return deferred.promise;
    };

    function setValidFieldsForExpressions(objectData) {
        // only numbers
        // neglect the field in questions or else shit gets recursive
        // console.log(objectData);
        var keys = Object.keys(objectData);
        $scope.validFieldsForExpressions = _.filter(keys, function(key) {
            return ((objectData[key].dataType === 'number'));
        });
    };
  });
